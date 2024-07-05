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
 * Class which handles rest endpoints
 */
export default class Rest {
    /**
     * Constuctor of Rest object
     *
     * @function Object() { [native code] }
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
     * Method that makes paginated GET API Requests using $pageSize and $page parameters
     *
     * @param {string} url of the resource to retrieve
     * @param {number} [pageSize] of the response, defaults to 50
     * @param {string} [iteratorField] attribute of the response to iterate over (only required if it's not 'items'|'definitions'|'entry')
     * @returns {Promise.<any>} API response combined items
     */
    async getBulk(url, pageSize = 50, iteratorField) {
        let page = 1;
        const baseUrl = url.split('?')[0];
        const isTransactionalMessageApi = this._isTransactionalMessageApi(baseUrl);
        const isLegacyApi = this._isLegacyApi(baseUrl);
        const queryParameters = new URLSearchParams(url.split('?')[1]);
        let collector;
        let shouldPaginate = false;
        let pageSizeKey = '$pageSize';
        let pageKey = '$page';
        let countKey = 'count';
        if (isLegacyApi) {
            pageSizeKey = '$top';
            pageKey = '$skip';
            countKey = 'totalResults';
            page = 0; // legacy index starts with 0
            if (pageSize != 50) {
                // values other than 50 are ignored by at least some of the sub-endpoints; while others have 50 as the maximum.
                pageSize = 50;
            }
        }
        queryParameters.set(pageSizeKey, Number(pageSize).toString());
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

            // merge results with existing
            if (collector && Array.isArray(responseBatch[iteratorField])) {
                collector[iteratorField].push(...responseBatch[iteratorField]);
            } else if (!collector) {
                collector = responseBatch;
            }
            // ! the transactional message API returns a value for "count" that represents the currently returned number of records, instead of the total amount. checking for count != pageSize is a workaround for this
            // * opened Support Case #43988240 for this issue
            if (
                isTransactionalMessageApi &&
                responseBatch[countKey] != responseBatch[pageSizeKey]
            ) {
                shouldPaginate = false;
            }
            // if results are less than size, no more requested needed
            else if (responseBatch[iteratorField].length < pageSize) {
                shouldPaginate = false;
            }
            // stop if total amount is same as the current amount (all have been retrieved)
            else if (collector[iteratorField].length >= responseBatch[countKey]) {
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
                if (this.options?.eventHandlers?.onLoop) {
                    this.options.eventHandlers.onLoop(undefined, collector?.[iteratorField]);
                }
            }
        } while (shouldPaginate);
        return collector;
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
            requestOptions.baseURL = this.auth.authObject.rest_instance_url;
            requestOptions.headers = headers;
            requestOptions.headers.Authorization = `Bearer ` + this.auth.authObject.access_token;
            remainingAttempts--;
            if (this.options?.eventHandlers?.logRequest) {
                this.options.eventHandlers.logRequest(requestOptions);
            }
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
                error.endpoint =
                    requestOptions.baseURL +
                    (requestOptions.url.startsWith('/')
                        ? requestOptions.url.slice(1)
                        : requestOptions.url);
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
