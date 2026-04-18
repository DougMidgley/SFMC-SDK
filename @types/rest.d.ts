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
    constructor(authObject: object, options: object);
    auth: any;
    options: any;
    transactionalApis: string[];
    /**
     * Method that makes the GET API request
     *
     * @param {string} url of the resource to retrieve
     * @returns {Promise.<any>} API response
     */
    get(url: string): Promise<any>;
    /**
     * helper for {@link this.getBulk} to determine if the url is a transactional message API
     *
     * @private
     * @param {string} url url without query params
     * @returns {boolean} true if the url is a transactional message API
     */
    private _isTransactionalMessageApi;
    /**
     * helper for {@link this.getBulk} to determine if the url is a legacy API
     *
     * @private
     * @param {string} url url without query params
     * @returns {boolean} true if the url is a legacy API
     */
    private _isLegacyApi;
    /**
     * Shared pagination loop for {@link this.getBulk} and {@link this.getBulkPages}.
     * Yields once per HTTP response. When `accumulate` is true, merges into `collector` (getBulk).
     * When false, only tracks a running row count so the SDK does not retain all pages in memory (getBulkPages).
     *
     * @param {string} url
     * @param {number} pageSize
     * @param {string} [iteratorField]
     * @param {boolean} emitOnLoop - when true, fires `eventHandlers.onLoop` (getBulk path only)
     * @param {boolean} accumulate - when false, do not merge pages into one array
     * @yields {{ iteratorField: string, pageItems: any[], page: number, totalPages?: number, totalCount?: number, responseBatch: object, collector?: object }}
     */
    _iterateBulkPages(url: string, pageSize?: number, iteratorField?: string, emitOnLoop?: boolean, accumulate?: boolean): AsyncGenerator<{
        iteratorField: string;
        pageItems: any;
        page: number;
        totalPages: number;
        totalCount: number;
        responseBatch: any;
        collector: any;
    }, void, unknown>;
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
    getBulk(url: string, pageSize?: number, iteratorField?: string): Promise<any>;
    /**
     * Paginated GET requests without retaining all pages in one merged array on the SDK side
     * for consumers that stream results. Yields one object per HTTP response; each `pageItems`
     * array is only the current page. Does not fire `eventHandlers.onLoop` (use yield fields instead).
     *
     * @param {string} url of the resource to retrieve
     * @param {number} [pageSize] of the response, defaults to 50
     * @param {string} [iteratorField] attribute of the response to iterate over (only required if it's not 'items'|'definitions'|'entry')
     * @returns {AsyncGenerator<{ iteratorField: string, pageItems: any[], page: number, totalPages?: number, totalCount?: number, responseBatch: object }>}
     */
    getBulkPages(url: string, pageSize?: number, iteratorField?: string): AsyncGenerator<{
        iteratorField: string;
        pageItems: any[];
        page: number;
        totalPages?: number;
        totalCount?: number;
        responseBatch: object;
    }>;
    /**
     * Method that makes a GET API request for each URL (including rate limiting)
     *
     * @param {string[]} urlArray of the resource to retrieve
     * @param {number} [concurrentLimit] number of requests to execute at once
     * @returns {Promise.<Array>} API response
     */
    getCollection(urlArray: string[], concurrentLimit?: number): Promise<any[]>;
    /**
     * Method that makes the POST api request
     *
     * @param {string} url of the resource to create
     * @param {object} payload for the POST request body
     * @param {object} [headers] optional headers to include in the request; note that Authorization-header is always overwritten
     * @returns {Promise.<any>} API response
     */
    post(url: string, payload: object, headers?: object): Promise<any>;
    /**
     * Method that makes the PUT api request
     *
     * @param {string} url of the resource to replace
     * @param {object} payload for the PUT request body
     * @param {object} [headers] optional headers to include in the request; note that Authorization-header is always overwritten
     * @returns {Promise.<any>} API response
     */
    put(url: string, payload: object, headers?: object): Promise<any>;
    /**
     * Method that makes the PATCH api request
     *
     * @param {string} url of the resource to update
     * @param {object} payload for the PATCH request body
     * @param {object} [headers] optional headers to include in the request; note that Authorization-header is always overwritten
     * @returns {Promise.<any>} API response
     */
    patch(url: string, payload: object, headers?: object): Promise<any>;
    /**
     * Method that makes the DELETE api request
     *
     * @param {string} url of the resource to delete
     * @returns {Promise.<any>} API response
     */
    delete(url: string): Promise<any>;
    /**
     * Method that makes the api request
     *
     * @param {object} requestOptions configuration for the request including body
     * @param {number} remainingAttempts number of times this request should be reattempted in case of error
     * @param {object} [headers] optional headers to include in the request; note that Authorization-header is always overwritten
     * @returns {Promise.<any>} Results from the Rest request in Object format
     */
    _apiRequest(requestOptions: object, remainingAttempts: number, headers?: object): Promise<any>;
}
//# sourceMappingURL=rest.d.ts.map