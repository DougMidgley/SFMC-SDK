/**
 * Class which handles SOAP endpoints
 */
export default class Soap {
    /**
     * Constuctor of Soap object
     *
     * @function Object() { [native code] }
     * @param {Object.<string, any>} auth Auth object used for initializing
     * @param {Object.<string, any>} options options for the SDK as a whole, for example collection of handler functions, or retry settings
     */
    constructor(auth: {
        [x: string]: any;
    }, options: {
        [x: string]: any;
    });
    /**
    @type {any}
     */
    auth: any;
    /**
    @type {any}
     */
    options: any;
    /**
     * Method used to retrieve data via SOAP API
     *
     * @param {string} type - SOAP Object type
     * @param {string[]} propertiesList - Properties which should be retrieved
     * @param {Object.<string, any>} [requestParameters] - additional RetrieveRequest parameters, for example filter or options
     * @returns {Promise.<any>} SOAP object converted from XML
     */
    retrieve(type: string, propertiesList: string[], requestParameters?: {
        [x: string]: any;
    }): Promise<any>;
    /**
     * Method used to retrieve all data via SOAP API
     *
     * @param {string} type - SOAP Object type
     * @param {string[]} propertiesList - Properties which should be retrieved
     * @param {Object.<string, any>} [requestParameters] - additional RetrieveRequest parameters, for example filter or options
     * @returns {Promise.<any>} SOAP object converted from XML
     */
    retrieveBulk(type: string, propertiesList: string[], requestParameters?: {
        [x: string]: any;
    }): Promise<any>;
    /**
     * Method used to create data via SOAP API
     *
     * @param {string} type - SOAP Object type
     * @param {Object.<string, any>} properties - Properties with values which should be created
     * @param {Object.<string, any>} [requestParameters] - additional RetrieveRequest parameters, for example filter or options
     * @returns {Promise.<any>} SOAP object converted from XML
     */
    create(type: string, properties: {
        [x: string]: any;
    }, requestParameters?: {
        [x: string]: any;
    }): Promise<any>;
    /**
     * Method used to update data via SOAP API
     *
     * @param {string} type - SOAP Object type
     * @param {Object.<string, any>} properties - Properties with values which should be updated
     * @param {Object.<string, any>} [requestParameters] - additional RetrieveRequest parameters, for example filter or options
     * @returns {Promise.<any>} SOAP object converted from XML
     */
    update(type: string, properties: {
        [x: string]: any;
    }, requestParameters?: {
        [x: string]: any;
    }): Promise<any>;
    /**
     * Method used to delete data via SOAP API
     *
     * @param {string} type - SOAP Object type
     * @param {Object.<string, any>} properties - Properties with values
     * @param {Object.<string, any>} [requestParameters] - additional RetrieveRequest parameters, for example filter or options
     * @returns {Promise.<any>} SOAP object converted from XML
     */
    delete(type: string, properties: {
        [x: string]: any;
    }, requestParameters?: {
        [x: string]: any;
    }): Promise<any>;
    /**
     * Method used to schedule data via SOAP API
     *
     * @param {string} type - SOAP Object type
     * @param {Object.<string, any>} schedule - object for what the schedule should be
     * @param {any[] | object} interactions - Object or array of interactions
     * @param {string} action - type of schedule
     * @param {Object.<string, any>} [options] - additional options for the request
     * @returns {Promise.<any>} SOAP object converted from XML
     */
    schedule(type: string, schedule: {
        [x: string]: any;
    }, interactions: any[] | object, action: string, options?: {
        [x: string]: any;
    }): Promise<any>;
    /**
     * Method used to describe metadata via SOAP API
     *
     * @param {string} type - SOAP Object type
     * @returns {Promise.<any>} SOAP object converted from XML
     */
    describe(type: string): Promise<any>;
    /**
     * Method used to execute data via SOAP API
     *
     * @param {string} type - SOAP Object type
     * @param {Object.<string, any>} properties - Properties with values
     * @returns {Promise.<any>} SOAP object converted from XML
     */
    execute(type: string, properties: {
        [x: string]: any;
    }): Promise<any>;
    /**
     * Method used to execute data via SOAP API
     *
     * @param {string} type - SOAP Object type
     * @param {string} action - type of action, for example 'Start'
     * @param {Object.<string, any>} payload - relevant payload to perform, for example query Definition
     * @returns {Promise.<any>} SOAP object converted from XML
     */
    perform(type: string, action: string, payload: {
        [x: string]: any;
    }): Promise<any>;
    /**
     * Method used to configure data via SOAP API
     *
     * @param {string} type - SOAP Object type
     * @param {object[]} configArray - Properties which should be updated
     * @returns {Promise.<any>} SOAP object converted from XML
     */
    configure(type: string, configArray: object[]): Promise<any>;
    /**
     * Method that makes the api request
     *
     * @param {Object.<string, any>} options configuration for the request including body
     * @param {number} remainingAttempts number of times this request should be reattempted in case of error
     * @returns {Promise.<any>} Results from the SOAP request in Object format
     */
    _apiRequest(options: {
        [x: string]: any;
    }, remainingAttempts: number): Promise<any>;
}
//# sourceMappingURL=soap.d.ts.map