'use strict';

const axios = require('axios');
const { isConnectionError } = require('./util');
module.exports = class Auth {
    /**
     * Creates an instance of Auth.
     *
     * @param {object} authObject Auth Payload
     * @param {string} authObject.client_id Client Id from SFMC config
     * @param {string} authObject.client_secret Client Secret from SFMC config
     * @param {number} authObject.account_id MID of Business Unit used for API Calls
     * @param {string} authObject.auth_url Auth URL from SFMC config
     * @param {string} [authObject.scope] Scope used for requests
     * @param {object} options options for the SDK as a whole, for example collection of handler functions, or retry settings
     */
    constructor(authObject, options) {
        if (!authObject) {
            throw new Error('authObject are required. see readme.');
        } else if (!authObject.client_id) {
            throw new Error('client_id or client_secret is missing or invalid');
        } else if (typeof authObject.client_id !== 'string') {
            throw new Error('client_id or client_secret must be strings');
        } else if (!authObject.client_secret) {
            throw new Error('client_id or client_secret is missing or invalid');
        } else if (typeof authObject.client_secret !== 'string') {
            throw new Error('client_id or client_secret must be strings');
        } else if (!authObject.account_id) {
            throw new Error('account_id is missing or invalid');
        } else if (!Number.isInteger(Number.parseInt(authObject.account_id))) {
            throw new Error(
                'account_id must be an Integer (Integers in String format are accepted)'
            );
        } else if (!authObject.auth_url) {
            throw new Error('auth_url is missing or invalid');
        } else if (typeof authObject.auth_url !== 'string') {
            throw new Error('auth_url must be a string');
        } else if (
            !/https:\/\/[a-z0-9-]{28}\.auth\.marketingcloudapis\.com\//gm.test(authObject.auth_url)
        ) {
            throw new Error(
                'auth_url must be in format https://mcXXXXXXXXXXXXXXXXXXXXXXXXXX.auth.marketingcloudapis.com/'
            );
        }
        // TODO add check for scope
        this.authObject = Object.assign(this.authObject || {}, authObject);
        this.options = options;
    }
    /**
     *
     *
     * @param {boolean} forceRefresh used to enforce a refresh of token
     * @param {number} remainingAttempts number of retries in case of issues
     * @returns {Promise<object>} current session information
     */
    async getAccessToken(forceRefresh, remainingAttempts) {
        if (remainingAttempts === undefined) {
            remainingAttempts = this.options.requestAttempts;
        }
        if (Boolean(forceRefresh) || _isExpired(this.authObject)) {
            try {
                this.authObject = await _requestToken(this.authObject);
            } catch (ex) {
                if (
                    this.options.retryOnConnectionError &&
                    remainingAttempts &&
                    isConnectionError(ex.code)
                ) {
                    if (this.options?.eventHandlers?.onConnectionError) {
                        this.options.eventHandlers.onConnectionError(ex, remainingAttempts);
                    }
                    remainingAttempts--;
                    return this.getAccessToken(forceRefresh, remainingAttempts);
                } else {
                    throw ex;
                }
            }

            if (this.options?.eventHandlers?.onRefresh) {
                this.options.eventHandlers.onRefresh(this.authObject);
            }
        }
        return this.authObject;
    }
};
/**
 * @param {object} authObject Auth object
 * @returns {boolean} true if token is expired
 */
function _isExpired(authObject) {
    let expired = false;
    // if current atomic time is equal or after exp, or we don't have a token, return true
    if (
        (authObject.expiration && authObject.expiration <= process.hrtime()[0]) ||
        !authObject.access_token
    ) {
        expired = true;
    }

    return expired;
}
/**
 *
 *
 * @param {object} authObject Auth Object for api calls
 * @returns {Promise<object>} updated Auth Object
 */
async function _requestToken(authObject) {
    // TODO retry logic
    const payload = {
        grant_type: 'client_credentials',
        client_id: authObject.client_id,
        client_secret: authObject.client_secret,
        account_id: authObject.account_id,
    };
    if (authObject.scope) {
        payload.scope = authObject.scope;
    }
    const res = await axios({
        method: 'post',
        baseURL: authObject.auth_url,
        url: '/v2/token',
        data: payload,
    });
    return Object.assign(authObject, res.data, {
        expiration: process.hrtime()[0] + res.data.expires_in,
    });
}
