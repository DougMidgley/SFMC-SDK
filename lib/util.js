'use strict';
/**
 * Method to check if Object passed is a simple object
 *
 * @param {object} object Object to check
 * @returns {boolean} true if is simple Object
 */
export function isObject(object) {
    return Object.prototype.toString.call(object) === '[object Object]';
}

/**
 * Method to check if Object passed is a valid payload for API calls
 *
 * @param {object} object Object to check
 * @returns {boolean} true if is a valid payload
 */
export function isPayload(object) {
    return Object.prototype.toString.call(object) === '[object Object]' || Array.isArray(object);
}

/**
 * Method to check if it is a connection error
 *
 * @param {string} code returned code from exception
 * @returns {boolean} true if a connection error
 */
// TODO DEPRECATE IN SOAP
export function isConnectionError(code) {
    return (
        code &&
        ['ETIMEDOUT', 'EHOSTUNREACH', 'ENOTFOUND', 'ECONNRESET', 'ECONNABORTED'].includes(code)
    );
}

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
    constructor(response, responseBody) {
        // Expired Error
        if (responseBody?.message) {
            super(responseBody.message);
            this.code = responseBody.errorcode;
        }
        // Unauthenticated
        else if (responseBody?.error_description) {
            super(responseBody?.error_description);
            this.code = responseBody?.error;
        } else {
            super('Unhandled Exception. See details');
        }
        this.response = response;
        this.json = responseBody;
        this.endpoint = response.url;
        this.name = this.constructor.name;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, RestError);
        }
    }
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
    constructor(ex, url) {
        super(ex.message);
        this.code = ex.code;
        this.endpoint = url;
        this.name = this.constructor.name;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, NetworkError);
        }
    }
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
    constructor(response, responseBody) {
        // Content Error
        if (responseBody && ['Error', 'Has Errors'].includes(responseBody.OverallStatus)) {
            super('One or more errors in the Results');
            this.code = responseBody.OverallStatus;
        }
        // Payload Error
        else if (responseBody && responseBody['soap:Fault']) {
            const fault = responseBody['soap:Fault'];
            super(fault.faultstring);
            this.code = fault.faultcode;
        }
        // General Request Error
        else if (response?.status > 299) {
            super('Error with SOAP Request');
            this.code = response?.status;
        }
        // unsupported handler
        else if (responseBody?.OverallStatus?.startsWith('Error:')) {
            super(responseBody.OverallStatus.split('Error:')[1].trim());
            this.code = 'Error';
        }
        // Fallback Unknown Error
        else {
            super('Unknown Error');
            this.code = '520';
        }
        this.response = response;
        this.json = responseBody;
        this.endpoint = response.url;
        this.name = this.constructor.name;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, SOAPError);
        }
    }
}
/**
 * Method to check if the repsonse is JSON
 *
 * @param {object} apiResponse Fetch response before parsing body
 * @returns {boolean} true if is simple Object
 */
export function isJSONResponse(apiResponse) {
    return !!apiResponse.headers.get('content-type')?.includes('application/json');
}

import axios from 'axios';
export const axiosInstance = axios.create();
