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
    constructor(authObject: AuthObject, options?: SDKOptions);
    auth: Auth;
    rest: Rest;
    soap: Soap;
}
/**
 * - Auth object
 */
export type AuthObject = {
    /**
     * - expiration time of token
     */
    expiration?: number;
    /**
     * - access token
     */
    access_token: string;
    /**
     * - client id of installed package
     */
    client_id: string;
    /**
     * - client secret of installed package
     */
    client_secret: string;
    /**
     * - auth url for the SFMC instance
     */
    auth_url: string;
    /**
     * - MID of the business unit you want to access
     */
    account_id: string;
    /**
     * - URL for rest requests returned from token request
     */
    rest_instance_url?: string;
    /**
     * - URL for soap requests returned from token request
     */
    soap_instance_url?: string;
    /**
     * - array of scopes for the request
     */
    scope?: string[];
};
/**
 * - options for the SDK as a whole, for example collection of handler functions, or retry settings
 */
export type SDKOptions = {
    /**
     * number of retries which should be done, defaulted to 1
     */
    requestAttempts?: number;
    /**
     * should request be retried in case of connection issues
     */
    retryOnConnectionError?: boolean;
    /**
     * collection of functions which are executed on certain events
     */
    eventHandlers?: object;
};
import Auth from './auth.js';
import Rest from './rest.js';
import Soap from './soap.js';
//# sourceMappingURL=index.d.ts.map