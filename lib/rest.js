'use strict';

const axios = require('axios');
const { isObject } = require('./util');
const pLimit = require('p-limit');

module.exports = class Rest {
    /**
     * Constuctor of Rest object
     * @constructor
     * @param {Object} auth Auth object used for initializing
     * @param {Object} eventHandlers collection of handler functions (for examplef or logging)
     */
    constructor(auth, eventHandlers) {
        this.auth = auth;
        this.eventHandlers = eventHandlers;
    }

    /**
     * Method that makes the GET API request
     * @param {string} url of the resource to retrieve
     * @returns {Promise<Object>} API response
     */
    get(url) {
        return _apiRequest(
            this.auth,
            {
                method: 'GET',
                url: url,
            },
            1
        );
    }
    /**
     * Method that makes paginated GET API Requests using $pageSize and $page parameters
     * @param {string} url of the resource to retrieve
     * @returns {Promise<Object>} API response combined items
     */
    async getBulk(url) {
        let page = 1;
        const baseUrl = url.split('?')[0];
        const queryParams = new URLSearchParams(url.split('?')[1]);
        let collector;
        let shouldContinue = false;
        queryParams.set('$pageSize', Number(2).toString());
        do {
            queryParams.set('$page', Number(page).toString());

            const temp = await _apiRequest(
                this.auth,
                {
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
                shouldContinue = false;
            } else {
                page++;
                shouldContinue = true;
            }
        } while (shouldContinue);
        return collector;
    }
    /**
     * Method that makes a GET API request for each URL (including rate limiting)
     * @param {Array<String>} urlArray of the resource to retrieve
     * @param {number} [concurrentLimit=5] number of requests to execute at once
     * @returns {Promise<Array>} API response
     */
    getCollection(urlArray, concurrentLimit) {
        const limit = pLimit(concurrentLimit || 5);
        return Promise.all(
            urlArray.map((url) =>
                limit(() =>
                    _apiRequest(
                        this.auth,
                        {
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
     * @param {string} url of the resource to create
     * @param {Object} payload for the POST request body
     * @returns {Promise<Object>} API response
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
     * @param {string} url of the resource to replace
     * @param {Object} payload for the PUT request body
     * @returns {Promise<Object>} API response
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
     * @param {string} url of the resource to update
     * @param {Object} payload for the PATCH request body
     * @returns {Promise<Object>} API response
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
     * @param {string} url of the resource to delete
     * @returns {Promise<Object>} API response
     */
    delete(url) {
        return _apiRequest(
            this.auth,
            {
                method: 'DELETE',

                url: url,
            },
            1
        );
    }
};
/**
 * method to check if the payload is plausible and throw error if not
 * @param {Object} options API request opptions
 * @returns {Void} throws error if issue
 */
function _checkPayload(options) {
    if (!isObject(options.data)) {
        throw new TypeError(`${options.method} requests require a payload in options.data`);
    }
}
/**
 * Method that makes the api request
 * @param {Object} auth - Auth Object used to make request
 * @param {Object} options configuration for the request including body
 * @param {number} remainingAttempts number of times this request should be reattempted in case of error
 * @returns {Promise<Object>} Results from the Rest request in Object format
 */
async function _apiRequest(auth, options, remainingAttempts) {
    if (!isObject(options)) {
        throw new TypeError('options argument is required');
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
        if (ex.response && ex.response.status === 404 && remainingAttempts) {
            // force refresh due to url related issue
            await auth.getAccessToken(true);
            return _apiRequest(auth, options, remainingAttempts--);
        } else {
            throw ex;
        }
    }
}
