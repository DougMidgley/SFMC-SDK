/**
 * Method to check if Object passed is a simple object
 *
 * @param {object} obj Object to check
 * @returns {boolean} true if is simple Object
 */
module.exports.isObject = (obj) =>
    Object.prototype.toString.call(obj) === '[object Object]' ||
    Object.prototype.toString.call(obj) === '[object Array]';

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
