/**
 * Class which handles SOAP endpoints
 */
export default class Soap {
    /**
     * Constuctor of Soap object
     *
     * @function Object() { [native code] }
     * @param {object} auth Auth object used for initializing
     * @param {object} options options for the SDK as a whole, for example collection of handler functions, or retry settings
     */
    constructor(auth: object, options: object);
    auth: any;
    options: any;
    /**
     * Method used to retrieve data via SOAP API
     *
     * @param {string} type - SOAP Object type
     * @param {string[]} propertiesList - Properties which should be retrieved
     * @param {object} [requestParameters] - additional RetrieveRequest parameters, for example filter or options
     * @returns {Promise.<any>} SOAP object converted from XML
     */
    retrieve(type: string, propertiesList: string[], requestParameters?: object): Promise<any>;
    /**
     * Method used to retrieve all data via SOAP API
     *
     * @param {string} type - SOAP Object type
     * @param {string[]} propertiesList - Properties which should be retrieved
     * @param {object} [requestParameters] - additional RetrieveRequest parameters, for example filter or options
     * @returns {Promise.<any>} SOAP object converted from XML
     */
    retrieveBulk(type: string, propertiesList: string[], requestParameters?: object): Promise<any>;
    /**
     * Method used to create data via SOAP API
     *
     * @param {string} type - SOAP Object type
     * @param {object} properties - Properties with values which should be created
     * @param {object} [requestParameters] - additional RetrieveRequest parameters, for example filter or options
     * @returns {Promise.<any>} SOAP object converted from XML
     */
    create(type: string, properties: object, requestParameters?: object): Promise<any>;
    /**
     * Method used to update data via SOAP API
     *
     * @param {string} type - SOAP Object type
     * @param {object} properties - Properties with values which should be updated
     * @param {object} [requestParameters] - additional RetrieveRequest parameters, for example filter or options
     * @returns {Promise.<any>} SOAP object converted from XML
     */
    update(type: string, properties: object, requestParameters?: object): Promise<any>;
    /**
     * Method used to delete data via SOAP API
     *
     * @param {string} type - SOAP Object type
     * @param {object} properties - Properties with values
     * @param {object} [requestParameters] - additional RetrieveRequest parameters, for example filter or options
     * @returns {Promise.<any>} SOAP object converted from XML
     */
    delete(type: string, properties: object, requestParameters?: object): Promise<any>;
    /**
     * Method used to schedule data via SOAP API
     *
     * @param {string} type - SOAP Object type
     * @param {object} schedule - object for what the schedule should be
     * @param {Array | object} interactions - Object or array of interactions
     * @param {string} action - type of schedule
     * @param {object} [options] - additional options for the request
     * @returns {Promise.<any>} SOAP object converted from XML
     */
    schedule(type: string, schedule: object, interactions: any[] | object, action: string, options?: object): Promise<any>;
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
     * @param {object} properties - Properties with values
     * @returns {Promise.<any>} SOAP object converted from XML
     */
    execute(type: string, properties: object): Promise<any>;
    /**
     * Method used to execute data via SOAP API
     *
     * @param {string} type - SOAP Object type
     * @param {string} action - type of action, for example 'Start'
     * @param {object} payload - relevant payload to perform, for example query Definition
     * @returns {Promise.<any>} SOAP object converted from XML
     */
    perform(type: string, action: string, payload: object): Promise<any>;
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
     * @param {object} options configuration for the request including body
     * @param {number} remainingAttempts number of times this request should be reattempted in case of error
     * @returns {Promise.<any>} Results from the SOAP request in Object format
     */
    _apiRequest(options: object, remainingAttempts: number): Promise<any>;
}
//# sourceMappingURL=soap.d.ts.map