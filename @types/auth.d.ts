/**
 * Class which handles authentication logic
 */
export default class Auth {
    /**
     * Creates an instance of Auth.
     *
     * @param {import('./index.js').AuthObject} authObject Auth Payload
     * @param {import('./index.js').SDKOptions} options options for the SDK as a whole, for example collection of handler functions, or retry settings
     * eventHandlers
     */
    constructor(authObject: import("./index.js").AuthObject, options: import("./index.js").SDKOptions);
    authObject: import("./index.js").AuthObject;
    options: import("./index.js").SDKOptions;
    /**
     *
     *
     * @param {boolean} [forceRefresh] used to enforce a refresh of token
     * @returns {Promise.<any>} current session information
     */
    getAccessToken(forceRefresh?: boolean): Promise<any>;
    /**
     * Helper to get back list of scopes supported by SDK
     *
     * @returns {string[]} array of potential scopes
     */
    getSupportedScopes(): string[];
}
//# sourceMappingURL=auth.d.ts.map