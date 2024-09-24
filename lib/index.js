'use strict';
import Auth from './auth.js';
import Rest from './rest.js';
import Soap from './soap.js';

/**
 * @typedef {object} AuthObject - Auth object
 * @property {number} [expiration] - expiration time of token
 * @property {string} access_token - access token
 * @property {string} client_id - client id of installed package
 * @property {string} client_secret - client secret of installed package
 * @property {string} auth_url - auth url for the SFMC instance
 * @property {string} account_id - MID of the business unit you want to access
 * @property {string} [rest_instance_url] - URL for rest requests returned from token request
 * @property {string} [soap_instance_url] - URL for soap requests returned from token request
 * @property {string[]} [scope] - array of scopes for the request
 */

/**
 * @typedef {object} SDKOptions - options for the SDK as a whole, for example collection of handler functions, or retry settings
 * @property {number} [requestAttempts] number of retries which should be done, defaulted to 1
 * @property {boolean} [retryOnConnectionError] should request be retried in case of connection issues
 * @property {object} [eventHandlers] collection of functions which are executed on certain events
 */

/**
 * Class main handler for the SDK
 */
export default class SDK {
    /**
     * Creates an instance of SDK.
     *
     * @param {AuthObject} authObject Auth Object for making requests
     * @param {SDKOptions} [options] options for the SDK as a whole, for example collection of handler functions, or retry settings
     */
    constructor(authObject, options) {
        if (options == undefined) {
            options = {};
        }
        if (options.requestAttempts == undefined) {
            options.requestAttempts = 1;
        }
        if (options.retryOnConnectionError == undefined) {
            options.retryOnConnectionError = true;
        }
        this.auth = new Auth(authObject, options);
        this.rest = new Rest(this.auth, options);
        this.soap = new Soap(this.auth, options);
    }
}
