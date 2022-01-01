/**
 * Method to check if Object passed is a simple object
 *
 * @param {object} obj Object to check
 * @returns {boolean} true if is simple Object
 */
module.exports.isObject = (obj) => Object.prototype.toString.call(obj) === '[object Object]' || Object.prototype.toString.call(obj) === '[object Array]';
