'use strict';
import {
    isObject,
    isPayload,
    isConnectionError,
    RestError,
    axiosInstance as axios,
} from './util.js';
import pLimit from 'p-limit';

/**
 * One page yielded by {@link Rest._iterateBulkPages} (and exposed by {@link Rest.getBulkPages}).
 *
 * @typedef {object} RestBulkPageYield
 * @property {string} iteratorField Response property name used as the row array.
 * @property {Array} pageItems Rows for this HTTP response only.
 * @property {number} page Current page index (`$page` / legacy `$skip` index).
 * @property {number} [totalPages] Estimated total pages when total count is numeric (normal REST only).
 * @property {number} [totalCount] Total row count from the API when available.
 * @property {object} responseBatch Raw JSON body for this page.
 * @property {object} [collector] Accumulated object for {@link Rest.getBulk}; omitted when not accumulating.
 */

/**
 * Class which handles rest endpoints
 */
export default class Rest {
    /**
     * Constructor of Rest object
     *
     * @param {object} authObject Auth object used for initializing
     * @param {object} options options for the SDK as a whole, for example collection of handler functions, or retry settings
     */
    constructor(authObject, options) {
        this.auth = authObject;
        this.options = options;
        this.transactionalApis = [
            '/messaging/v1/email/definitions',
            '/messaging/v1/push/definitions',
            '/messaging/v1/sms/definitions',
        ];
    }

    /**
     * Method that makes the GET API request
     *
     * @param {string} url of the resource to retrieve
     * @returns {Promise.<any>} API response
     */
    get(url) {
        return this._apiRequest(
            {
                method: 'GET',
                url: url,
            },
            this.options.requestAttempts
        );
    }
    /**
     * helper for {@link this.getBulk} to determine if the url is a transactional message API
     *
     * @private
     * @param {string} url url without query params
     * @returns {boolean} true if the url is a transactional message API
     */
    _isTransactionalMessageApi(url) {
        return url && this.transactionalApis.some((api) => url.includes(api));
    }
    /**
     * helper for {@link this.getBulk} to determine if the url is a legacy API
     *
     * @private
     * @param {string} url url without query params
     * @returns {boolean} true if the url is a legacy API
     */
    _isLegacyApi(url) {
        return url && url.startsWith('/legacy/v1/');
    }
    /**
     * Shared pagination loop for {@link this.getBulk} and {@link this.getBulkPages}.
     * Yields once per HTTP response. When `accumulate` is true, merges into `collector` (getBulk).
     * When false, only tracks a running row count so the SDK does not retain all pages in memory (getBulkPages).
     *
     * @param {string} url Resource path (and optional query); pagination keys are applied by the SDK.
     * @param {number} pageSize Page size (`$pageSize` / legacy `$top`).
     * @param {string} [iteratorField] Response property holding the row array when not `items`/`definitions`/`entry`.
     * @param {boolean} emitOnLoop - when true, fires `eventHandlers.onLoop` (getBulk path only)
     * @param {boolean} accumulate - when false, do not merge pages into one array
     * @yields {RestBulkPageYield}
     */
    async *_iterateBulkPages(url, pageSize = 50, iteratorField, emitOnLoop = false, accumulate = true) {
        let page = 1;
        const baseUrl = url.split('?')[0];
        const isTransactionalMessageApi = this._isTransactionalMessageApi(baseUrl);
        const isLegacyApi = this._isLegacyApi(baseUrl);
        const queryParameters = new URLSearchParams(url.split('?')[1]);
        let collector;
        let accumulatedLength = 0;
        /** @type {boolean} */
        let shouldPaginate;
        let pageSizeKey = '$pageSize';
        let pageKey = '$page';
        let countKey = 'count';
        if (isLegacyApi) {
            pageSizeKey = '$top';
            pageKey = '$skip';
            countKey = 'totalResults';
            page = 0; // legacy index starts with 0
            if (pageSize !== 50) {
                // values other than 50 are ignored by at least some of the sub-endpoints; while others have 50 as the maximum.
                pageSize = 50;
            }
        }
        queryParameters.set(pageSizeKey, Number(pageSize).toString());
        try {
            do {
                queryParameters.set(pageKey, Number(page).toString());
                const responseBatch = await this._apiRequest(
                    {
                        method: 'GET',
                        url: baseUrl + '?' + decodeURIComponent(queryParameters.toString()),
                    },
                    this.options.requestAttempts
                );

                // determine iterator field if not provided
                if (iteratorField && Array.isArray(responseBatch[iteratorField])) {
                    // if the iteratorField is set, use it
                } else if (Array.isArray(responseBatch.items)) {
                    iteratorField = 'items';
                } else if (Array.isArray(responseBatch.definitions)) {
                    iteratorField = 'definitions';
                } else if (Array.isArray(responseBatch.entry)) {
                    iteratorField = 'entry';
                } else {
                    throw new TypeError('Could not find an array to iterate over');
                }

                const pageItems = responseBatch[iteratorField];

                if (accumulate) {
                    // merge results with existing
                    if (collector && Array.isArray(responseBatch[iteratorField])) {
                        collector[iteratorField].push(...responseBatch[iteratorField]);
                    } else if (!collector) {
                        collector = responseBatch;
                    }
                } else {
                    accumulatedLength += pageItems.length;
                }

                const mergedLength = accumulate ? collector[iteratorField].length : accumulatedLength;

                const totalCountRaw = responseBatch[countKey];
                const totalCountNumber = Number(totalCountRaw);
                /** @type {number|undefined} */
                let totalPages;
                if (!isTransactionalMessageApi && !isLegacyApi && Number.isFinite(totalCountNumber)) {
                    totalPages = Math.ceil(totalCountNumber / pageSize);
                }

                yield {
                    iteratorField,
                    pageItems,
                    page,
                    totalPages,
                    totalCount: Number.isFinite(totalCountNumber) ? totalCountNumber : undefined,
                    responseBatch,
                    collector: accumulate ? collector : undefined,
                };

                // ! the transactional message API returns a value for "count" that represents the currently returned number of records, instead of the total amount. checking for count != pageSize is a workaround for this
                // * opened Support Case #43988240 for this issue
                if (isTransactionalMessageApi && responseBatch[countKey] === pageSize) {
                    page++;
                    shouldPaginate = true;
                    if (emitOnLoop && this.options?.eventHandlers?.onLoop) {
                        this.options.eventHandlers.onLoop(undefined, collector?.[iteratorField]);
                    }
                } // if results are less than size, no more requested needed
                else if (responseBatch[iteratorField].length < pageSize) {
                    shouldPaginate = false;
                }
                // stop if total amount is same as the current amount (all have been retrieved)
                else if (mergedLength >= responseBatch[countKey]) {
                    shouldPaginate = false;
                }
                // stop if response contains no results (for whatever reason) - this is a known issue on legacy API
                else if (responseBatch[iteratorField].length === 0) {
                    shouldPaginate = false;
                }
                // otherwise loop
                else {
                    page++;
                    shouldPaginate = true;
                    if (emitOnLoop && this.options?.eventHandlers?.onLoop) {
                        const totalCount = Number(responseBatch[countKey]);
                        const totalPagesLoop = Math.ceil(totalCount / pageSize);
                        /** @type {{ nextPage: number, totalPages: number, accumulatedCount: number }} */
                        const loopContext = {
                            nextPage: page,
                            totalPages: totalPagesLoop,
                            accumulatedCount: mergedLength,
                        };
                        this.options.eventHandlers.onLoop(
                            undefined,
                            collector?.[iteratorField],
                            loopContext,
                        );
                    }
                }
            } while (shouldPaginate);
        } finally {
            // allows generator.return() from consumers to exit cleanly
        }
    }

    /**
     * Method that makes paginated GET API Requests using $pageSize and $page parameters
     *
     * When another page is needed, `options.eventHandlers.onLoop` may receive a third
     * argument `context` (normal REST pagination only). `context.totalPages` is computed by the
     * SDK as `Math.ceil(response[count or totalResults] / pageSize)`; it is not a field returned
     * directly by the API.
     *
     * @param {string} url of the resource to retrieve
     * @param {number} [pageSize] of the response, defaults to 50
     * @param {string} [iteratorField] attribute of the response to iterate over (only required if it's not 'items'|'definitions'|'entry')
     * @returns {Promise.<any>} API response combined items
     */
    async getBulk(url, pageSize = 50, iteratorField) {
        /** @type {object|undefined} */
        let collector;
        for await (const step of this._iterateBulkPages(url, pageSize, iteratorField, true, true)) {
            collector = step.collector;
        }
        return collector;
    }

    /**
     * Paginated GET requests without retaining all pages in one merged array on the SDK side
     * for consumers that stream results. Yields one object per HTTP response; each `pageItems`
     * array is only the current page. Does not fire `eventHandlers.onLoop` (use yield fields instead).
     *
     * @param {string} url of the resource to retrieve
     * @param {number} [pageSize] of the response, defaults to 50
     * @param {string} [iteratorField] attribute of the response to iterate over (only required if it's not 'items'|'definitions'|'entry')
     * @yields {RestBulkPageYield}
     * @returns {object} Async generator yielding one {@link RestBulkPageYield} per HTTP response.
     */
    async *getBulkPages(url, pageSize = 50, iteratorField) {
        for await (const step of this._iterateBulkPages(url, pageSize, iteratorField, false, false)) {
            yield {
                iteratorField: step.iteratorField,
                pageItems: step.pageItems,
                page: step.page,
                totalPages: step.totalPages,
                totalCount: step.totalCount,
                responseBatch: step.responseBatch,
            };
        }
    }
    /**
     * Method that makes a GET API request for each URL (including rate limiting)
     *
     * @param {string[]} urlArray of the resource to retrieve
     * @param {number} [concurrentLimit] number of requests to execute at once
     * @returns {Promise.<Array>} API response
     */
    async getCollection(urlArray, concurrentLimit) {
        const limit = pLimit(concurrentLimit || 5);
        // run auth before to avoid parallel requests
        await this.auth.getAccessToken();
        return Promise.all(
            urlArray.map((url) =>
                limit(() =>
                    this._apiRequest(
                        {
                            method: 'GET',
                            url: url,
                        },
                        this.options.requestAttempts
                    )
                )
            )
        );
    }
    /**
     * Method that makes the POST api request
     *
     * @param {string} url of the resource to create
     * @param {object} payload for the POST request body
     * @param {object} [headers] optional headers to include in the request; note that Authorization-header is always overwritten
     * @returns {Promise.<any>} API response
     */
    post(url, payload, headers) {
        const requestOptions = {
            method: 'POST',
            url: url,
            data: payload,
        };
        _checkPayload(requestOptions);
        return this._apiRequest(requestOptions, this.options.requestAttempts, headers);
    }
    /**
     * Method that makes the PUT api request
     *
     * @param {string} url of the resource to replace
     * @param {object} payload for the PUT request body
     * @param {object} [headers] optional headers to include in the request; note that Authorization-header is always overwritten
     * @returns {Promise.<any>} API response
     */
    put(url, payload, headers) {
        const requestOptions = {
            method: 'PUT',
            url: url,
            data: payload,
        };
        _checkPayload(requestOptions);
        return this._apiRequest(requestOptions, this.options.requestAttempts, headers);
    }
    /**
     * Method that makes the PATCH api request
     *
     * @param {string} url of the resource to update
     * @param {object} payload for the PATCH request body
     * @param {object} [headers] optional headers to include in the request; note that Authorization-header is always overwritten
     * @returns {Promise.<any>} API response
     */
    patch(url, payload, headers) {
        const requestOptions = {
            method: 'PATCH',
            url: url,
            data: payload,
        };
        _checkPayload(requestOptions);
        return this._apiRequest(requestOptions, this.options.requestAttempts, headers);
    }
    /**
     * Method that makes the DELETE api request
     *
     * @param {string} url of the resource to delete
     * @returns {Promise.<any>} API response
     */
    delete(url) {
        return this._apiRequest(
            {
                method: 'DELETE',
                url: url,
            },
            this.options.requestAttempts
        );
    }
    /**
     * Method that makes the api request
     *
     * @param {object} requestOptions configuration for the request including body
     * @param {number} remainingAttempts number of times this request should be reattempted in case of error
     * @param {object} [headers] optional headers to include in the request; note that Authorization-header is always overwritten
     * @returns {Promise.<any>} Results from the Rest request in Object format
     */
    async _apiRequest(requestOptions, remainingAttempts, headers = {}) {
        if (!isObject(requestOptions)) {
            throw new Error('requestOptions argument is required');
        }
        try {
            await this.auth.getAccessToken();
        } catch (error) {
            // Token request can return 401 before rest_instance_url is set; mirror legacy behavior:
            // force refresh once, then retry the whole request with a single attempt budget.
            if (error.response && error.response.status === 401 && remainingAttempts) {
                await this.auth.getAccessToken(true);
                return this._apiRequest(requestOptions, 1);
            }
            throw new RestError(error);
        }
        requestOptions.baseURL = this.auth.authObject.rest_instance_url;
        requestOptions.headers = headers;
        requestOptions.headers.Authorization = `Bearer ${this.auth.authObject.access_token}`;
        remainingAttempts--;
        if (this.options?.eventHandlers?.logRequest) {
            this.options.eventHandlers.logRequest(requestOptions);
        }
        try {
            const response = await axios(requestOptions);
            if (this.options?.eventHandlers?.logResponse) {
                this.options.eventHandlers.logResponse({
                    data: response.data,
                    status: response.status,
                });
            }
            return response.data;
        } catch (error) {
            if (requestOptions.url) {
                const base = requestOptions.baseURL ?? '';
                const pathPart = requestOptions.url.startsWith('/')
                    ? requestOptions.url.slice(1)
                    : requestOptions.url;
                error.endpoint = base ? base + pathPart : pathPart;
            }
            if (
                this.options.retryOnConnectionError &&
                remainingAttempts > 0 &&
                isConnectionError(error.code)
            ) {
                if (this.options?.eventHandlers?.onConnectionError) {
                    this.options.eventHandlers.onConnectionError(error, remainingAttempts);
                }
                return this._apiRequest(requestOptions, remainingAttempts);
            } else if (error.response && error.response.status === 401 && remainingAttempts) {
                // force refresh due to url related issue
                await this.auth.getAccessToken(true);
                //only retry once on refresh since there should be no reason for this token to be invalid
                return this._apiRequest(requestOptions, 1);
            } else {
                throw new RestError(error);
            }
        }
    }
}

/**
 * method to check if the payload is plausible and throw error if not
 *
 * @param {object} options API request opptions
 */
function _checkPayload(options) {
    if (!isPayload(options.data)) {
        throw new Error(`${options.method} requests require a payload in options.data`);
    }
}
