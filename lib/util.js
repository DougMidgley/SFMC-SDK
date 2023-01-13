/**
 * Method to check if Object passed is a simple object
 *
 * @param {object} obj Object to check
 * @returns {boolean} true if is simple Object
 */
module.exports.isObject = (obj) => Object.prototype.toString.call(obj) === '[object Object]';

/**
 * Method to check if Object passed is a valid payload for API calls
 *
 * @param {object} obj Object to check
 * @returns {boolean} true if is a valid payload
 */
module.exports.isPayload = (obj) =>
    Object.prototype.toString.call(obj) === '[object Object]' || Array.isArray(obj);

/**
 * Method to check if it is a connection error
 *
 * @param {string} code returned code from exception
 * @returns {boolean} true if a connection error
 */
module.exports.isConnectionError = (code) =>
    code && ['ETIMEDOUT', 'EHOSTUNREACH', 'ENOTFOUND', 'ECONNRESET', 'ECONNABORTED'].includes(code);

/**
 * CustomError type for handling REST (including Auth) based errors
 *
 * @class RestError
 * @augments {Error}
 */
module.exports.RestError = class RestError extends Error {
    constructor(ex, url) {
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
        if (url) {
            this.endpoint = url;
        }
        this.response = ex.response;
        this.name = this.constructor.name;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, RestError);
        }
    }
};

/**
 * CustomError type for handling SOAP based errors
 *
 * @class SOAPError
 * @augments {Error}
 */
module.exports.SOAPError = class SOAPError extends Error {
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
        // Fallback Error
        else {
            super(ex.message);
            this.code = ex.code;
        }
        this.response = response;
        this.json = soapBody;
        this.name = this.constructor.name;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, SOAPError);
        }
    }
};
