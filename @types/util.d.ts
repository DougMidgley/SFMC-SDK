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
 * Method to check if the repsonse is JSON
 *
 * @param {object} apiResponse Fetch response before parsing body
 * @returns {boolean} true if is simple Object
 */
export function isJSONResponse(apiResponse: object): boolean;
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
     * @param {object} response api respone
     * @param {object} responseBody rest body
     */
    constructor(response: object, responseBody: object);
    code: any;
    response: any;
    json: any;
    endpoint: any;
}
/**
 * CustomError type for handling Network based errors
 * ie. errors not returning a 400-500 code
 *
 * @class NetworkError
 * @augments {Error}
 */
export class NetworkError extends Error {
    /**
     * @param {Error} ex Error object
     * @param {string} url url of request, if available
     */
    constructor(ex: Error, url: string);
    code: any;
    endpoint: string;
}
/**
 * CustomError type for handling SOAP based errors
 *
 * @class SOAPError
 * @augments {Error}
 */
export class SOAPError extends Error {
    /**
     *
     * @param {object} response api response
     * @param {object} responseBody response body (parsed)
     */
    constructor(response: object, responseBody: object);
    code: any;
    response: any;
    json: any;
    endpoint: any;
}
export const axiosInstance: import("axios").AxiosInstance;
/**
 * - Error object
 */
export type EnhancedRestError = object;
//# sourceMappingURL=util.d.ts.map