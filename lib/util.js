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
export function isConnectionError(code) {
    return (
        code &&
        ['ETIMEDOUT', 'EHOSTUNREACH', 'ENOTFOUND', 'ECONNRESET', 'ECONNABORTED'].includes(code)
    );
}

/**
 * @typedef {object} EnhancedRestErrorHelper - Error object
 * @property {object} response -
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
    constructor(ex) {
        // Expired Error
        if (ex.response?.data?.message) {
            super(ex.response.data.message);
            this.code = ex.response.data.errorcode || ex.code;
        }
        // Unauthenticated
        else if (ex.response?.data?.error_description) {
            super(ex.response.data.error_description);
            this.code = ex.response.data.error || ex.code;
        } else {
            super(ex.message);
            this.code = ex.code;
        }
        if (ex.endpoint) {
            this.endpoint = ex.endpoint;
        }
        this.response = ex.response;
        this.name = this.constructor.name;
    }
}
/**
 * @typedef {object} EnhancedSoapErrorHelper  - Error object
 * @property {object} response -
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
     * @param {EnhancedSoapError} ex Error object
     * @param {object} response api respone
     * @param {object} soapBody soap body
     */
    constructor(ex, response, soapBody) {
        // Content Error
        if (soapBody && ['Error', 'Has Errors'].includes(soapBody.OverallStatus)) {
            super('One or more errors in the Results');
            this.code = soapBody.OverallStatus;
        }
        // Payload Error
        else if (soapBody && soapBody['soap:Fault']) {
            const fault = soapBody['soap:Fault'];
            super(fault.faultstring);
            this.code = fault.faultcode;
        }
        // Request Error
        else if (response?.status > 299) {
            super('Error with SOAP Request');
            this.code = response?.status;
        }
        // unsupported handler
        else if (soapBody?.OverallStatus?.startsWith('Error:')) {
            super(soapBody.OverallStatus.split('Error:')[1].trim());
            this.code = 'Error';
        }
        // Fallback Error
        else if (ex) {
            super(ex.message);
            this.code = ex.code;
        }
        // Fallback Unknown Error
        else {
            super('Unknown Error');
            this.code = '520';
        }
        this.response = response;
        this.json = soapBody;
        this.name = this.constructor.name;
    }
}
import axios from 'axios';
export const axiosInstance = axios.create();
