'use strict';

const axios = require('axios');
module.exports = class Auth {
    /**
     * Creates an instance of Auth.
     * @param {Object} options Auth Payload
     * @param {string} options.client_id Client Id from SFMC config
     * @param {string} options.client_secret Client Secret from SFMC config
     * @param {number} options.account_id MID of Business Unit used for API Calls
     * @param {string} options.auth_url Auth URL from SFMC config
     * @param {string} [options.scope] Scope used for requests
     * @param {Object} eventHandlers collection of handler functions (for examplef or logging)
     */
    constructor(options, eventHandlers) {
        if (options) {
            if (!options.client_id) {
                throw new Error('clientId or clientSecret is missing or invalid');
            }
            if (typeof options.client_id !== 'string') {
                throw new Error('client_id or client_secret must be strings');
            }
            if (!options.client_secret) {
                throw new Error('client_id or client_secret is missing or invalid');
            }
            if (typeof options.client_secret !== 'string') {
                throw new Error('client_id or client_secret must be strings');
            }
            if (!options.account_id) {
                throw new Error('account_id is missing or invalid');
            }
            if (!Number.isInteger(options.account_id)) {
                throw new Error('account_id must be an integer');
            }
            if (!options.auth_url) {
                throw new Error('auth_url is missing or invalid');
            }
            if (typeof options.auth_url !== 'string') {
                throw new Error('auth_url must be a string');
            }
            if (
                !/https:\/\/[a-z0-9\-]{28}\.auth\.marketingcloudapis\.com\//gm.test(options.auth_url)
            ) {
                throw new Error(
                    'auth_url must be in format https://mcXXXXXXXXXXXXXXXXXXXXXXXXXX.auth.marketingcloudapis.com/'
                );
            }
            // TODO add check for scope
        } else {
            throw new Error('options are required. see readme.');
        }

        this.options = Object.assign(this.options || {}, options);
        this.eventHandlers = eventHandlers;
    }
    /**
     *
     *
     * @param {Boolean} forceRefresh used to enforce a refresh of token
     * @return {Promise<Object>} current session information
     */
    async getAccessToken(forceRefresh) {
        if (Boolean(forceRefresh) || _isExpired(this.options)) {
            this.options = await _requestToken(this.options);
            if (this.eventHandlers && this.eventHandlers.onRefresh) {
                this.eventHandlers.onRefresh(this.options);
            }
        }
        return this.options;
    }
};
/**
 * @param {Object} options Auth object
 * @return {Boolean} true if token is expired
 */
function _isExpired(options) {
    let expired = false;
    // if current atomic time is equal or after exp, or we don't have a token, return true
    if (
        (options.expiration && options.expiration <= process.hrtime()[0]) ||
        !options.access_token
    ) {
        expired = true;
    }

    return expired;
}
/**
 *
 *
 * @param {Object} options Auth Object for api calls
 * @return {Promise<Object>} updated Auth Object
 */
async function _requestToken(options) {
    // TODO retry logic
    const payload = {
        grant_type: 'client_credentials',
        client_id: options.client_id,
        client_secret: options.client_secret,
        account_id: options.account_id,
    };
    if (options.scope) {
        payload.scope = options.scope;
    }
    const res = await axios({
        method: 'post',
        baseURL: options.auth_url,
        url: '/v2/token',
        data: payload,
    });
    const newAuth = Object.assign(options, res.data);
    newAuth.expiration = process.hrtime()[0] + res.data.expires_in;
    return newAuth;
}
