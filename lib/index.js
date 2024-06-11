'use strict';
import Auth from './auth.js';
import Rest from './rest.js';
import Soap from './soap.js';

/**
 * Class main handler for the SDK
 */
export default class SDK {
    /**
     * Creates an instance of SDK.
     * @param {object} authObject Auth Object for making requests
     * @param {object} options options for the SDK as a whole, for example collection of handler functions, or retry settings
     * @param {number} [options.requestAttempts] number of retries which should be done, defaulted to 1
     * @param {boolean} [options.retryOnConnectionError] should request be retried in case of connection issues
     * @param {object} [options.eventHandlers] collection of functions which are executed on certain events
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
