/**
 * Method to check if Object passed is a simple object
 * @param {Object} obj Object to check
 * @returns {Boolean} true if is simple Object
 */
module.exports.isObject = (obj) => Object.prototype.toString.call(obj) === '[object Object]';
