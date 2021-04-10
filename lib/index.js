const Auth = require('./auth');
const Rest = require('./rest');
const Soap = require('./soap');

module.exports = class SDK {
    /**
     * Creates an instance of SDK.
     * @param {Object} options Auth Object for making requests
     */
    constructor(options) {
        const auth = new Auth(options);
        this.rest = new Rest(auth);
        this.soap = new Soap(auth);
    }
};
