/**
 * Method to check if Object passed is a simple object
 *
 * @param {object} object Object to check
 * @returns {boolean} true if is simple Object
 */
export function isObject(object: object): boolean;
/**
 * Method to check if Object passed is a valid payload for API calls
 *
 * @param {object} object Object to check
 * @returns {boolean} true if is a valid payload
 */
export function isPayload(object: object): boolean;
/**
 * Method to check if it is a connection error
 *
 * @param {string} code returned code from exception
 * @returns {boolean} true if a connection error
 */
export function isConnectionError(code: string): boolean;
/**
 * @typedef {object} EnhancedRestError - Error object
 * @augments {Error}
 * @property {object} response -
 * @property {string} code -
 * @property {string} endpoint -
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
    endpoint: any;
    response: any;
}
/**
 * @typedef {object} EnhancedSoapError - Error object
 * @augments {Error}
 * @property {object} response -
 * @property {string} code -
 * @property {string} endpoint -
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
     * @param {EnhancedSoapError} ex Error object
     * @param {object} response api respone
     * @param {object} soapBody soap body
     */
    constructor(ex: EnhancedSoapError, response: object, soapBody: object);
    code: any;
    response: any;
    json: any;
}
export const axiosInstance: import("axios").AxiosInstance;
/**
 * - Error object
 */
export type EnhancedRestError = object;
/**
 * - Error object
 */
export type EnhancedSoapError = object;
//# sourceMappingURL=util.d.ts.map