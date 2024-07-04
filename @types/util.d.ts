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
 * @typedef {object} SFMCRestError - Error object
 * @property {object} response -
 * @property {string} code -
 * @property {string} endpoint -
 * @typedef {Error & SFMCRestError} EnhancedRestError - Error object
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
    endpoint: string;
    response: any;
}
/**
 * @typedef {object} SFMCSoapError - Error object
 * @property {object} response -
 * @property {string} code -
 * @property {string} endpoint -
 * @typedef {SFMCSoapError & Error} EnhancedSoapError - Error object
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
export type SFMCRestError = {
    /**
     * -
     */
    response: object;
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
export type EnhancedRestError = Error & SFMCRestError;
/**
 * - Error object
 */
export type SFMCSoapError = {
    /**
     * -
     */
    response: object;
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
export type EnhancedSoapError = SFMCSoapError & Error;
//# sourceMappingURL=util.d.ts.map