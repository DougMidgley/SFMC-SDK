const Auth = require('./auth');
const Rest = require('./rest');
const Soap = require('./soap');

module.exports = class SDK {
    /**
     * Creates an instance of SDK.
     * @param {Object} options Auth Object for making requests
     * @param {Object} eventHandlers collection of handler functions (for examplef or logging)
     */
    constructor(options, eventHandlers) {
        this.auth = new Auth(options, eventHandlers);
        this.rest = new Rest(this.auth, eventHandlers);
        this.soap = new Soap(this.auth, eventHandlers);
    }
};
