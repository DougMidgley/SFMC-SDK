/**
 * Method to check if Object passed is a simple object
 *
 * @param {Object.<string, any>} object Object to check
 * @returns {boolean} true if is simple Object
 */
export function isObject(object: {
    [x: string]: any;
}): boolean;
/**
 * Method to check if Object passed is a valid payload for API calls
 *
 * @param {Object.<string, any>} object Object to check
 * @returns {boolean} true if is a valid payload
 */
export function isPayload(object: {
    [x: string]: any;
}): boolean;
/**
 * Method to check if it is a connection error
 *
 * @param {string} code returned code from exception
 * @returns {boolean|string} true if a connection error, otherwise the original empty code or false
 */
export function isConnectionError(code: string): boolean | string;
/**
 * @typedef {object} EnhancedRestErrorHelper - Error object
 * @property {Object.<string, any>} response -
 * @property {string} code -
 * @property {string} endpoint -
 * @typedef {Error & EnhancedRestErrorHelper} EnhancedRestError - Error object
 */
/**
 * CustomError type for handling REST (including Auth) based errors
 *
 * @class RestError
 * @augments {Error}
 */
export class RestError extends Error {
    /**
     *
     * @param {EnhancedRestError} ex Error object
     */
    constructor(ex: EnhancedRestError);
    code: any;
    endpoint: string | undefined;
    /**
    @type {any}
     */
    response: any;
}
/**
 * @typedef {object} EnhancedSoapErrorHelper  - Error object
 * @property {Object.<string, any>} response -
 * @property {string} code -
 * @property {string} endpoint -
 * @typedef {Error & EnhancedSoapErrorHelper } EnhancedSoapError - Error object
 */
/**
 * CustomError type for handling SOAP based errors
 *
 * @class SOAPError
 * @augments {Error}
 */
export class SOAPError extends Error {
    /**
     *
     * @param {EnhancedSoapError | undefined} ex Error object
     * @param {Object.<string, any> | undefined} response api respone
     * @param {Object.<string, any> | undefined} soapBody soap body
     */
    constructor(ex: EnhancedSoapError | undefined, response: {
        [x: string]: any;
    } | undefined, soapBody: {
        [x: string]: any;
    } | undefined);
    code: any;
    /**
    @type {any}
     */
    response: any;
    /**
    @type {any}
     */
    json: any;
}
export const axiosInstance: import("axios").AxiosInstance;
/**
 * - Error object
 */
export type EnhancedRestErrorHelper = {
    /**
     * -
     */
    response: {
        [x: string]: any;
    };
    /**
     * -
     */
    code: string;
    /**
     * -
     */
    endpoint: string;
};
/**
 * - Error object
 */
export type EnhancedRestError = Error & EnhancedRestErrorHelper;
/**
 * - Error object
 */
export type EnhancedSoapErrorHelper = {
    /**
     * -
     */
    response: {
        [x: string]: any;
    };
    /**
     * -
     */
    code: string;
    /**
     * -
     */
    endpoint: string;
};
/**
 * - Error object
 */
export type EnhancedSoapError = Error & EnhancedSoapErrorHelper;
//# sourceMappingURL=util.d.ts.map