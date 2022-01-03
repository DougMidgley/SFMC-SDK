'use strict';

const axios = require('axios');
const { isObject } = require('./util');
const pLimit = require('p-limit');

module.exports = class Rest {
    /**
     * Constuctor of Rest object
     *
     * @function Object() { [native code] }
     * @param {object} auth Auth object used for initializing
     * @param {object} eventHandlers collection of handler functions (for examplef or logging)
     */
    constructor(auth, eventHandlers) {
        this.auth = auth;
        this.eventHandlers = eventHandlers;
    }

    /**
     * Method that makes the GET API request
     *
     * @param {string} url of the resource to retrieve
     * @returns {Promise<object>} API response
     */
    get(url) {
            return _apiRequest(
                this.auth, {
                    method: 'GET',
                    url: url,
                },
                1
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
                const temp = await _apiRequest(
                    this.auth, {
                        method: 'GET',
                        url: baseUrl + '?' + decodeURIComponent(queryParams.toString()),
                    },
                    1
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
                        _apiRequest(
                            this.auth, {
                                method: 'GET',
                                url: url,
                            },
                            1
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
            const options = {
                method: 'POST',
                url: url,
                data: payload,
            };
            _checkPayload(options);
            return _apiRequest(this.auth, options, 1);
        }
        /**
         * Method that makes the PUT api request
         *
         * @param {string} url of the resource to replace
         * @param {object} payload for the PUT request body
         * @returns {Promise<object>} API response
         */
    put(url, payload) {
            const options = {
                method: 'PUT',
                url: url,
                data: payload,
            };
            _checkPayload(options);
            return _apiRequest(this.auth, options, 1);
        }
        /**
         * Method that makes the PATCH api request
         *
         * @param {string} url of the resource to update
         * @param {object} payload for the PATCH request body
         * @returns {Promise<object>} API response
         */
    patch(url, payload) {
            const options = {
                method: 'PATCH',
                url: url,
                data: payload,
            };
            _checkPayload(options);
            return _apiRequest(this.auth, options, 1);
        }
        /**
         * Method that makes the DELETE api request
         *
         * @param {string} url of the resource to delete
         * @returns {Promise<object>} API response
         */
    delete(url) {
        return _apiRequest(
            this.auth, {
                method: 'DELETE',

                url: url,
            },
            1
        );
    }
};
/**
 * method to check if the payload is plausible and throw error if not
 *
 * @param {object} options API request opptions
 */
function _checkPayload(options) {
    if (!isObject(options.data) || !Array.isArray(options.data)) {
        throw new Error(`${options.method} requests require a payload in options.data`);
    }
}
/**
 * Method that makes the api request
 *
 * @param {object} auth - Auth Object used to make request
 * @param {object} options configuration for the request including body
 * @param {number} remainingAttempts number of times this request should be reattempted in case of error
 * @returns {Promise<object>} Results from the Rest request in Object format
 */
async function _apiRequest(auth, options, remainingAttempts) {
    if (!isObject(options)) {
        throw new Error('options argument is required');
    }
    try {
        await auth.getAccessToken();
        const requestOptions = {
            method: options.method,
            baseURL: auth.options.rest_instance_url,
            url: options.url,
            headers: { Authorization: `Bearer ` + auth.options.access_token },
        };
        if (options.method.includes('POST', 'PATCH', 'PUT')) {
            requestOptions.data = options.data;
        }
        const res = await axios(requestOptions);
        return res.data;
    } catch (ex) {
        if (ex.response && ex.response.status === 401 && remainingAttempts) {
            // force refresh due to url related issue
            await auth.getAccessToken(true);
            remainingAttempts--;
            return _apiRequest(auth, options, remainingAttempts);
        } else {
            throw ex;
        }
    }
}