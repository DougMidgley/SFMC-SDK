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
     * @returns {Promise.<object>} SOAP object converted from XML
     */
    retrieve(type: string, propertiesList: string[], requestParameters?: object): Promise<object>;
    /**
     * Method used to retrieve all data via SOAP API
     *
     * @param {string} type - SOAP Object type
     * @param {string[]} propertiesList - Properties which should be retrieved
     * @param {object} [requestParameters] - additional RetrieveRequest parameters, for example filter or options
     * @returns {Promise.<object>} SOAP object converted from XML
     */
    retrieveBulk(type: string, propertiesList: string[], requestParameters?: object): Promise<object>;
    /**
     * Method used to create data via SOAP API
     *
     * @param {string} type - SOAP Object type
     * @param {object} properties - Properties with values which should be created
     * @param {object} [requestParameters] - additional RetrieveRequest parameters, for example filter or options
     * @returns {Promise.<object>} SOAP object converted from XML
     */
    create(type: string, properties: object, requestParameters?: object): Promise<object>;
    /**
     * Method used to update data via SOAP API
     *
     * @param {string} type - SOAP Object type
     * @param {object} properties - Properties with values which should be updated
     * @param {object} [requestParameters] - additional RetrieveRequest parameters, for example filter or options
     * @returns {Promise.<object>} SOAP object converted from XML
     */
    update(type: string, properties: object, requestParameters?: object): Promise<object>;
    /**
     * Method used to delete data via SOAP API
     *
     * @param {string} type - SOAP Object type
     * @param {object} properties - Properties with values
     * @param {object} [requestParameters] - additional RetrieveRequest parameters, for example filter or options
     * @returns {Promise.<object>} SOAP object converted from XML
     */
    delete(type: string, properties: object, requestParameters?: object): Promise<object>;
    /**
     * Method used to schedule data via SOAP API
     *
     * @param {string} type - SOAP Object type
     * @param {object} schedule - object for what the schedule should be
     * @param {Array | object} interactions - Object or array of interactions
     * @param {string} action - type of schedule
     * @param {object} [options] - additional options for the request
     * @returns {Promise.<object>} SOAP object converted from XML
     */
    schedule(type: string, schedule: object, interactions: any[] | object, action: string, options?: object): Promise<object>;
    /**
     * Method used to describe metadata via SOAP API
     *
     * @param {string} type - SOAP Object type
     * @returns {Promise.<object>} SOAP object converted from XML
     */
    describe(type: string): Promise<object>;
    /**
     * Method used to execute data via SOAP API
     *
     * @param {string} type - SOAP Object type
     * @param {object} properties - Properties with values
     * @returns {Promise.<object>} SOAP object converted from XML
     */
    execute(type: string, properties: object): Promise<object>;
    /**
     * Method used to execute data via SOAP API
     *
     * @param {string} type - SOAP Object type
     * @param {string} action - type of action, for example 'Start'
     * @param {object} payload - relevant payload to perform, for example query Definition
     * @returns {Promise.<object>} SOAP object converted from XML
     */
    perform(type: string, action: string, payload: object): Promise<object>;
    /**
     * Method used to configure data via SOAP API
     *
     * @param {string} type - SOAP Object type
     * @param {object[]} configArray - Properties which should be updated
     * @returns {Promise.<object>} SOAP object converted from XML
     */
    configure(type: string, configArray: object[]): Promise<object>;
    /**
     * Method that makes the api request
     *
     * @param {object} requestOptions configuration for the request including body
     * @returns {Promise.<object>} Results from the SOAP request in Object format
     */
    _apiRequest(requestOptions: object): Promise<object>;
}
//# sourceMappingURL=soap.d.ts.map