'use strict';

const axios = require('axios');
const { isObject } = require('./util');

module.exports = class Rest {
    /**
     * Constuctor of Rest object
     * @constructor
     * @param {Object} auth Auth object used for initializing
     */
    constructor(auth) {
        this.auth = auth;
    }

    /**
     * Method that makes the GET api request
     * @param {String} url of the resource to retrieve
     * @returns {Promise<Object>} API response
     */
    get(url) {
        return _apiRequest(this.auth, {
            method: 'GET',
            retry: true,
            url: url,
        });
    }
    /**
     * Method that makes the POST api request
     * @param {String} url of the resource to create
     * @param {Object} payload for the POST request body
     * @returns {Promise<Object>} API response
     */
    post(url, payload) {
        const options = {
            method: 'POST',
            retry: true,
            url: url,
            data: payload,
        };
        _checkPayload(options);
        return _apiRequest(this.auth, options);
    }
    /**
     * Method that makes the PUT api request
     * @param {String} url of the resource to replace
     * @param {Object} payload for the PUT request body
     * @returns {Promise<Object>} API response
     */
    put(url, payload) {
        const options = {
            method: 'PUT',
            retry: true,
            url: url,
            data: payload,
        };
        _checkPayload(options);
        return _apiRequest(this.auth, options);
    }
    /**
     * Method that makes the PATCH api request
     * @param {String} url of the resource to update
     * @param {Object} payload for the PATCH request body
     * @returns {Promise<Object>} API response
     */
    patch(url, payload) {
        const options = {
            method: 'PATCH',
            retry: true,
            url: url,
            data: payload,
        };
        _checkPayload(options);
        return _apiRequest(this.auth, options);
    }
    /**
     * Method that makes the DELETE api request
     * @param {String} url of the resource to delete
     * @returns {Promise<Object>} API response
     */
    delete(url) {
        return _apiRequest(this.auth, {
            method: 'DELETE',
            retry: true,
            url: url,
        });
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
 * @returns {Promise<Object>} Results from the Rest request in Object format
 */
async function _apiRequest(auth, options) {
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
            requestOptions.data = options.payload;
        }
        const res = await axios(requestOptions);
        return res.data;
    } catch (ex) {
        console.error(ex.message, ex.response);
        console.error(options);
    }
}
