'use strict';

const axios = require('axios');
const { isObject, isConnectionError } = require('./util');
const pLimit = require('p-limit');

module.exports = class Rest {
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
    }

    /**
     * Method that makes the GET API request
     *
     * @param {string} url of the resource to retrieve
     * @returns {Promise<object>} API response
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
     * Method that makes paginated GET API Requests using $pageSize and $page parameters
     *
     * @param {string} url of the resource to retrieve
     * @param {number} pageSize of the response, defaults to 50
     * @returns {Promise<object>} API response combined items
     */
    async getBulk(url, pageSize) {
        let page = 1;
        const baseUrl = url.split('?')[0];
        const queryParams = new URLSearchParams(url.split('?')[1]);
        let collector;
        let shouldPaginate = false;
        queryParams.set('$pageSize', Number(pageSize || 50).toString());
        do {
            queryParams.set('$page', Number(page).toString());
            const temp = await this._apiRequest(
                {
                    method: 'GET',
                    url: baseUrl + '?' + decodeURIComponent(queryParams.toString()),
                },
                this.options.requestAttempts
            );
            if (collector && Array.isArray(temp.items)) {
                collector.items.push(...temp.items);
            } else if (collector == null) {
                collector = temp;
            }
            if (Array.isArray(collector.items) && collector.items.length >= temp.count) {
                shouldPaginate = false;
            } else {
                page++;
                shouldPaginate = true;
            }
        } while (shouldPaginate);
        return collector;
    }
    /**
     * Method that makes a GET API request for each URL (including rate limiting)
     *
     * @param {Array<string>} urlArray of the resource to retrieve
     * @param {number} [concurrentLimit=5] number of requests to execute at once
     * @returns {Promise<Array>} API response
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
     * @returns {Promise<object>} API response
     */
    post(url, payload) {
        const requestOptions = {
            method: 'POST',
            url: url,
            data: payload,
        };
        _checkPayload(requestOptions);
        return this._apiRequest(requestOptions, this.options.requestAttempts);
    }
    /**
     * Method that makes the PUT api request
     *
     * @param {string} url of the resource to replace
     * @param {object} payload for the PUT request body
     * @returns {Promise<object>} API response
     */
    put(url, payload) {
        const requestOptions = {
            method: 'PUT',
            url: url,
            data: payload,
        };
        _checkPayload(requestOptions);
        return this._apiRequest(requestOptions, this.options.requestAttempts);
    }
    /**
     * Method that makes the PATCH api request
     *
     * @param {string} url of the resource to update
     * @param {object} payload for the PATCH request body
     * @returns {Promise<object>} API response
     */
    patch(url, payload) {
        const requestOptions = {
            method: 'PATCH',
            url: url,
            data: payload,
        };
        _checkPayload(requestOptions);
        return this._apiRequest(requestOptions, this.options.requestAttempts);
    }
    /**
     * Method that makes the DELETE api request
     *
     * @param {string} url of the resource to delete
     * @returns {Promise<object>} API response
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
     * @returns {Promise<object>} Results from the Rest request in Object format
     */
    async _apiRequest(requestOptions, remainingAttempts) {
        if (!isObject(requestOptions)) {
            throw new Error('requestOptions argument is required');
        }
        try {
            await this.auth.getAccessToken();
            requestOptions.baseURL = this.auth.authObject.rest_instance_url;
            requestOptions.headers = {
                Authorization: `Bearer ` + this.auth.authObject.access_token,
            };
            remainingAttempts--;
            const res = await axios(requestOptions);
            return res.data;
        } catch (ex) {
            if (
                this.options.retryOnConnectionError &&
                remainingAttempts > 0 &&
                isConnectionError(ex.code)
            ) {
                if (this.options?.eventHandlers?.onConnectionError) {
                    this.options.eventHandlers.onConnectionError(ex, remainingAttempts);
                }
                return this._apiRequest(requestOptions, remainingAttempts);
            } else if (ex.response && ex.response.status === 401 && remainingAttempts) {
                // force refresh due to url related issue
                await this.auth.getAccessToken(true);
                //only retry once on refresh since there should be no reason for this token to be invalid
                return this._apiRequest(requestOptions, 1);
            } else {
                throw ex;
            }
        }
    }
};
/**
 * method to check if the payload is plausible and throw error if not
 *
 * @param {object} options API request opptions
 */
function _checkPayload(options) {
    if (!isObject(options.data)) {
        throw new Error(`${options.method} requests require a payload in options.data`);
    }
}
