/**
 * Class which handles authentication logic
 */
export default class Auth {
    /**
     * Creates an instance of Auth.
     *
     * @param {object} authObject Auth Payload
     * @param {string} authObject.client_id Client Id from SFMC config
     * @param {string} authObject.client_secret Client Secret from SFMC config
     * @param {number} authObject.account_id MID of Business Unit used for API Calls
     * @param {string} authObject.auth_url Auth URL from SFMC config
     * @param {string[]} [authObject.scope] Array of scopes used for requests
     * @param {object} options options for the SDK as a whole, for example collection of handler functions, or retry settings
     * @param {object} options.requestAttempts number of attempts which should be made before
     * @param {object} options.retryOnConnectionError if continued attempts should be made in case of connection issue
     */
    constructor(authObject: {
        client_id: string;
        client_secret: string;
        account_id: number;
        auth_url: string;
        scope?: string[];
    }, options: {
        requestAttempts: object;
        retryOnConnectionError: object;
    });
    authObject: {
        client_id: string;
        client_secret: string;
        account_id: number;
        auth_url: string;
        scope?: string[];
    };
    options: {
        requestAttempts: object;
        retryOnConnectionError: object;
    };
    /**
     *
     *
     * @param {boolean} [forceRefresh] used to enforce a refresh of token
     * @returns {Promise.<object>} current session information
     */
    getAccessToken(forceRefresh?: boolean): Promise<object>;
    /**
     * Helper to get back list of scopes supported by SDK
     *
     * @returns {string[]} array of potential scopes
     */
    getSupportedScopes(): string[];
}
//# sourceMappingURL=auth.d.ts.map