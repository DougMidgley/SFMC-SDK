/**
 * @typedef {object} AuthObject - Auth object
 * @property {number} [expiration] - expiration time of token
 * @property {string} access_token - access token
 * @property {string} client_id - client id of installed package
 * @property {string} client_secret - client secret of installed package
 * @property {string} auth_url - auth url for the SFMC instance
 * @property {string} account_id - MID of the business unit you want to access
 * @property {string[]} [scope] - array of scopes for the request
 */
/**
 * Class which handles authentication logic
 */
export default class Auth {
    /**
     * Creates an instance of Auth.
     *
     * @param {AuthObject} authObject Auth Payload
     * @param {object} options options for the SDK as a whole, for example collection of handler functions, or retry settings
     */
    constructor(authObject: AuthObject, options: object);
    authObject: AuthObject;
    options: any;
    /**
     *
     *
     * @param {boolean} [forceRefresh] used to enforce a refresh of token
     * @param {number} [remainingAttempts] number of retries in case of issues
     * @returns {Promise.<any>} current session information
     */
    getAccessToken(forceRefresh?: boolean, remainingAttempts?: number): Promise<any>;
    /**
     * Helper to get back list of scopes supported by SDK
     *
     * @returns {string[]} array of potential scopes
     */
    getSupportedScopes(): string[];
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
     * - array of scopes for the request
     */
    scope?: string[];
};
//# sourceMappingURL=auth.d.ts.map