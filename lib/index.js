const Auth = require('./auth');
const Rest = require('./rest');
const Soap = require('./soap');

module.exports = class SDK {
    /**
     * Creates an instance of SDK.
     * @param {Object} options Auth Object for making requests
     */
    constructor(options, shouldPersist) {
        this.auth = new Auth(options, shouldPersist);
        this.rest = new Rest(this.auth);
        this.soap = new Soap(this.auth);
    }
};
