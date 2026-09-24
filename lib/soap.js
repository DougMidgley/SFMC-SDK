'use strict';
import { XMLBuilder, XMLParser } from 'fast-xml-parser';
import { isObject, isConnectionError, axiosInstance as axios, SOAPError } from './util.js';

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
    constructor(auth, options) {
        /**
        @type {any}
         */
        this.auth = auth;
        /**
        @type {any}
         */
        this.options = options;
    }

    /**
     * Method used to retrieve data via SOAP API
     *
     * @param {string} type - SOAP Object type
     * @param {string[]} propertiesList - Properties which should be retrieved
     * @param {Object.<string, any>} [requestParameters] - additional RetrieveRequest parameters, for example filter or options
     * @returns {Promise.<any>} SOAP object converted from XML
     */
    retrieve(type, propertiesList, requestParameters) {
        if (!type) {
            throw new Error('Retrieve requires a type');
        }
        if (!Array.isArray(propertiesList)) {
            throw new TypeError('Retrieve request requires one or more properties');
        }
        /**
        @type {Object.<string, any>}
         */
        const body = {
            RetrieveRequestMsg: {
                '@_xmlns': 'http\u{3A}//exacttarget.com/wsdl/partnerAPI',
                RetrieveRequest: {
                    ObjectType: type,
                    Properties: propertiesList,
                },
            },
        };

        if (requestParameters) {
            validateOptions(requestParameters.options, [
                'BatchSize',
                'IncludeObjects',
                'OnlyIncludeBase',
            ]);
            if (requestParameters.options) {
                body.RetrieveRequestMsg.RetrieveRequest.Options = requestParameters.options;
            }
            if (requestParameters.ClientIDs) {
                body.RetrieveRequestMsg.RetrieveRequest.ClientIDs = requestParameters.clientIDs;
            }
            // filter can be simple or complex and has three properties leftOperand, rightOperand, and operator
            if (requestParameters.filter) {
                body.RetrieveRequestMsg.RetrieveRequest.Filter = _parseFilter(
                    requestParameters.filter
                );
            }
            if (requestParameters.QueryAllAccounts) {
                body.RetrieveRequestMsg.RetrieveRequest.QueryAllAccounts = true;
            }
            if (requestParameters.continueRequest) {
                body.RetrieveRequestMsg.RetrieveRequest.ContinueRequest =
                    requestParameters.continueRequest;
            }
        }

        return this._apiRequest(
            {
                action: 'Retrieve',
                req: body,
                key: 'RetrieveResponseMsg',
            },
            this.options.requestAttempts
        );
    }
    /**
     * Method used to retrieve all data via SOAP API
     *
     * @param {string} type - SOAP Object type
     * @param {string[]} propertiesList - Properties which should be retrieved
     * @param {Object.<string, any>} [requestParameters] - additional RetrieveRequest parameters, for example filter or options
     * @returns {Promise.<any>} SOAP object converted from XML
     */
    async retrieveBulk(type, propertiesList, requestParameters) {
        let status;
        let resultsBulk;
        do {
            const resultsBatch = await this.retrieve(type, propertiesList, requestParameters);
            if (resultsBulk) {
                // once first batch is done, the follow just add to result payload
                resultsBulk.Results.push(...resultsBatch.Results);
            } else {
                resultsBulk = resultsBatch;
            }
            status = resultsBatch.OverallStatus;
            if (status !== 'MoreDataAvailable') {
                continue;
            }

            //as requestParams is by default optional, ensure object exists in this case
            requestParameters ||= {};
            requestParameters.continueRequest = resultsBatch.RequestID;
            if (this.options?.eventHandlers?.onLoop) {
                this.options.eventHandlers.onLoop(type, resultsBulk?.Results);
            }
        } while (status === 'MoreDataAvailable');
        return resultsBulk;
    }
    /**
     * Method used to create data via SOAP API
     *
     * @param {string} type - SOAP Object type
     * @param {Object.<string, any>} properties - Properties with values which should be created
     * @param {Object.<string, any>} [requestParameters] - additional RetrieveRequest parameters, for example filter or options
     * @returns {Promise.<any>} SOAP object converted from XML
     */
    create(type, properties, requestParameters) {
        if (!type) {
            throw new Error('Create requires a type');
        }
        if (Object.keys(properties).length === 0) {
            throw new Error('Create request requires one or more properties');
        }
        validateOptions(requestParameters?.options);
        /**
        @type {Object.<string, any>}
         */
        const body = {
            CreateRequest: {
                '@_xmlns': 'http\u{3A}//exacttarget.com/wsdl/partnerAPI',
                Options: requestParameters?.options,
                Objects: properties,
            },
        };
        body.CreateRequest.Objects['@_xsi:type'] = type;
        return this._apiRequest(
            {
                action: 'Create',
                req: body,
                key: 'CreateResponse',
            },
            this.options.requestAttempts
        );
    }
    /**
     * Method used to update data via SOAP API
     *
     * @param {string} type - SOAP Object type
     * @param {Object.<string, any>} properties - Properties with values which should be updated
     * @param {Object.<string, any>} [requestParameters] - additional RetrieveRequest parameters, for example filter or options
     * @returns {Promise.<any>} SOAP object converted from XML
     */
    update(type, properties, requestParameters) {
        if (!type) {
            throw new Error('Update requires a type');
        }
        if (Object.keys(properties).length === 0) {
            throw new Error('Update request requires one or more properties');
        }
        validateOptions(requestParameters?.options);
        /**
        @type {Object.<string, any>}
         */
        const body = {
            UpdateRequest: {
                '@_xmlns': 'http\u{3A}//exacttarget.com/wsdl/partnerAPI',
                Options: requestParameters?.options,
                Objects: properties,
            },
        };
        body.UpdateRequest.Objects['@_xsi:type'] = type;

        return this._apiRequest(
            {
                action: 'Update',
                req: body,
                key: 'UpdateResponse',
            },
            this.options.requestAttempts
        );
    }
    /**
     * Method used to delete data via SOAP API
     *
     * @param {string} type - SOAP Object type
     * @param {Object.<string, any>} properties - Properties with values
     * @param {Object.<string, any>} [requestParameters] - additional RetrieveRequest parameters, for example filter or options
     * @returns {Promise.<any>} SOAP object converted from XML
     */
    delete(type, properties, requestParameters) {
        if (!type) {
            throw new Error('Delete requires a type');
        }
        if (Object.keys(properties).length === 0) {
            throw new Error('Delete request requires one or more properties');
        }
        validateOptions(requestParameters?.options);
        /**
        @type {Object.<string, any>}
         */
        const body = {
            DeleteRequest: {
                '@_xmlns': 'http\u{3A}//exacttarget.com/wsdl/partnerAPI',
                Options: requestParameters?.options,
                Objects: properties,
            },
        };
        body.DeleteRequest.Objects['@_xsi:type'] = type;
        return this._apiRequest(
            {
                action: 'Delete',
                req: body,
                key: 'DeleteResponse',
            },
            this.options.requestAttempts
        );
    }
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
    schedule(type, schedule, interactions, action, options) {
        /**
        @type {Object.<string, any>}
         */
        const body = {
            ScheduleRequestMsg: {
                '@_xmlns': 'http\u{3A}//exacttarget.com/wsdl/partnerAPI',
                Action: action,
                Options: options,
                Schedule: schedule,
                Interactions: interactions,
            },
        };
        if (Array.isArray(body.ScheduleRequestMsg.Interactions)) {
            body.ScheduleRequestMsg.Interactions = body.ScheduleRequestMsg.Interactions.map(
                /**
                 * @param {Object.<string, any>} index interaction wrapper
                 * @returns {Object.<string, any>} typed interaction wrapper
                 */
                (index) => {
                    index.Interaction['@_xsi:type'] = type;
                    return index;
                }
            );
        } else if (isObject(body.ScheduleRequestMsg.Interactions)) {
            body.ScheduleRequestMsg.Interactions.Interaction['@_xsi:type'] = type;
        } else {
            throw new TypeError('Interactions must be of Array or Object Type');
        }
        validateOptions(options ?? {});
        return this._apiRequest(
            {
                action: 'Schedule',
                req: body,
                key: 'ScheduleResponseMsg',
            },
            this.options.requestAttempts
        );
    }
    /**
     * Method used to describe metadata via SOAP API
     *
     * @param {string} type - SOAP Object type
     * @returns {Promise.<any>} SOAP object converted from XML
     */
    describe(type) {
        if (!type) {
            throw new Error('Describe requires a type');
        }
        return this._apiRequest(
            {
                action: 'Describe',
                req: {
                    DefinitionRequestMsg: {
                        '@_xmlns': 'http\u{3A}//exacttarget.com/wsdl/partnerAPI',
                        DescribeRequests: {
                            ObjectDefinitionRequest: {
                                ObjectType: type,
                            },
                        },
                    },
                },
                key: 'DefinitionResponseMsg',
            },
            this.options.requestAttempts
        );
    }
    /**
     * Method used to execute data via SOAP API
     *
     * @param {string} type - SOAP Object type
     * @param {Object.<string, any>} properties - Properties with values
     * @returns {Promise.<any>} SOAP object converted from XML
     */
    execute(type, properties) {
        if (!type) {
            throw new Error('Execute requires a type');
        }
        return this._apiRequest(
            {
                action: 'Execute',
                req: {
                    ExecuteRequestMsg: {
                        '@_xmlns': 'http\u{3A}//exacttarget.com/wsdl/partnerAPI',
                        Requests: {
                            Name: type,
                            Parameters: properties,
                        },
                    },
                },
                key: 'ExecuteResponseMsg',
            },
            this.options.requestAttempts
        );
    }
    /**
     * Method used to execute data via SOAP API
     *
     * @param {string} type - SOAP Object type
     * @param {string} action - type of action, for example 'Start'
     * @param {Object.<string, any>} payload - relevant payload to perform, for example query Definition
     * @returns {Promise.<any>} SOAP object converted from XML
     */
    perform(type, action, payload) {
        if (!type) {
            throw new Error('Peform requires a type');
        }
        if (!payload) {
            throw new Error('Peform requires a payload, for example and Array of ObjectIDs');
        }
        const definition = Object.assign(
            {
                '@_xsi:type': type,
            },
            payload
        );
        return this._apiRequest(
            {
                action: 'Perform',
                req: {
                    PerformRequestMsg: {
                        '@_xmlns': 'http\u{3A}//exacttarget.com/wsdl/partnerAPI',
                        Action: action,
                        Definitions: [
                            {
                                Definition: definition,
                            },
                        ],
                    },
                },
                key: 'PerformResponseMsg',
            },
            this.options.requestAttempts
        );
    }
    /**
     * Method used to configure data via SOAP API
     *
     * @param {string} type - SOAP Object type
     * @param {object[]} configArray - Properties which should be updated
     * @returns {Promise.<any>} SOAP object converted from XML
     */
    configure(type, configArray) {
        if (!type) {
            throw new Error('Configure requires a type');
        }
        if (!Array.isArray(configArray) || configArray?.length == 0) {
            throw new Error('Configure request requires one or more entries');
        }
        /**
        @type {Object.<string, any>}
         */
        const body = {
            ConfigureRequestMsg: {
                '@_xmlns': 'http\u{3A}//exacttarget.com/wsdl/partnerAPI',
                Action: 'assign',
                Configurations: { Configuration: configArray },
            },
        };
        for (const config of configArray) {
            /**
            @type {Object.<string, any>}
             */
            const typedConfig = config;
            typedConfig['@_xsi:type'] = type;
        }

        return this._apiRequest(
            {
                action: 'Configure',
                req: body,
                key: 'ConfigureResponseMsg',
            },
            this.options.requestAttempts
        );
    }

    /**
     * Method that makes the api request
     *
     * @param {Object.<string, any>} options configuration for the request including body
     * @param {number} remainingAttempts number of times this request should be reattempted in case of error
     * @returns {Promise.<any>} Results from the SOAP request in Object format
     */
    async ['_apiRequest'](options, remainingAttempts) {
        if (!isObject(options)) {
            throw new TypeError('options argument is required');
        }

        await this.auth.getAccessToken();
        const requestOptions = {
            method: 'POST',
            baseURL: this.auth.authObject.soap_instance_url,
            url: '/Service.asmx',
            headers: {
                SOAPAction: options.action,
                'Content-Type': 'text/xml',
            },
            data: _buildEnvelope(options.req, this.auth.authObject.access_token),
        };
        if (this.options?.eventHandlers?.logRequest) {
            this.options.eventHandlers.logRequest(requestOptions);
        }
        let response;
        remainingAttempts--;
        try {
            response = await axios(requestOptions);
        } catch (error) {
            const requestError = /** @type {import('./util.js').EnhancedSoapError} */ (error);
            if (
                this.options.retryOnConnectionError &&
                remainingAttempts > 0 &&
                isConnectionError(requestError.code)
            ) {
                if (this.options?.eventHandlers?.onConnectionError) {
                    this.options.eventHandlers.onConnectionError(requestError, remainingAttempts);
                }
                return this._apiRequest(options, remainingAttempts);
            }
            if (requestError.response) {
                // if the response is received, then continue parsing and check for errors later
                response = requestError.response;
            } else {
                // if no response, then throw
                throw new SOAPError(requestError, undefined, undefined);
            }
        }
        if (this.options?.eventHandlers?.logResponse) {
            this.options.eventHandlers.logResponse({
                data: response.data,
                status: response.status,
                statusText: response.statusText,
                headers: response.headers,
            });
        }

        // handle rejected due to expired token
        try {
            // need to wait as it may error
            return await _parseResponse(response, options.key);
        } catch (error) {
            const soapError = /** @type {import('./util.js').EnhancedSoapError} */ (error);
            if (remainingAttempts && soapError.message === 'Token Expired') {
                // force refresh due to url related issue
                await this.auth.getAccessToken(true);
                // set to no more retries as after token refresh it should always work
                return this._apiRequest(options, 1);
            }
            if (soapError instanceof SOAPError) {
                //rethrow as is already handled/parsed
                throw soapError;
            }
            //unknown error
            throw new SOAPError(soapError, response, undefined);
        }
    }
}

/**
 * Method to build the payload then conver to XML
 *
 * @param {Object.<string, any>} request Object form of the payload
 * @param {string} token access token for authentication
 * @returns {string} XML string payload
 */
function _buildEnvelope(request, token) {
    const jsonToXml = new XMLBuilder({ ignoreAttributes: false });
    return jsonToXml.build({
        Envelope: {
            Body: request,
            '@_xmlns': 'http\u{3A}//schemas.xmlsoap.org/soap/envelope/',
            '@_xmlns:xsi': 'http\u{3A}//www.w3.org/2001/XMLSchema-instance',
            Header: {
                fueloauth: {
                    '@_xmlns': 'http\u{3A}//exacttarget.com',
                    '#text': token,
                },
            },
        },
    });
}

/**
 * Method to filter requests in SOAP
 *
 * @param {Object.<string, any>} filter Polymorphic filter object
 * @returns {object} formatted filter object
 */
function _parseFilter(filter) {
    let filterType = 'Simple';
    const object = {};

    if (isObject(filter.leftOperand) && isObject(filter.rightOperand)) {
        filterType = 'Complex';
    }

    switch (filterType.toLowerCase()) {
        case 'simple': {
            object.Property = filter.leftOperand;
            object.SimpleOperator = filter.operator;
            object.Value = filter.rightOperand;
            break;
        }
        case 'complex': {
            object.LeftOperand = _parseFilter(filter.leftOperand);
            object.LogicalOperator = filter.operator;
            object.RightOperand = _parseFilter(filter.rightOperand);
            break;
        }
    }

    object['@_xsi:type'] = filterType + 'FilterPart';

    return object;
}
/**
 * Method to parse the XML response
 *
 * @param {Object.<string, any>} response payload including whole SOAP response
 * @param {string} key key of the expected response body
 * @returns {Promise.<any | Error>} Result of request in Object format
 */
async function _parseResponse(response, key) {
    const xmlToJson = new XMLParser({ ignoreAttributes: true });
    const soapBody = xmlToJson.parse(response.data)?.['soap:Envelope']?.['soap:Body'];
    const responseBody = soapBody?.[key];
    if (responseBody) {
        // These should always be run no matter the execution
        // Results should always be an array
        if (isObject(responseBody.Results)) {
            responseBody.Results = [responseBody.Results];
        }
        // checks overall status error
        if (
            ['Error', 'Has Errors'].includes(responseBody.OverallStatus) ||
            responseBody.OverallStatus?.startsWith('Error:')
        ) {
            throw new SOAPError(undefined, response, responseBody);
        }
        return responseBody;
    }
    // something else went wrong but payload parsed
    throw new SOAPError(undefined, response, soapBody);
}
/**
 * Method checks options object for validity
 *
 * @param {Object.<string, any>} options configuration for the request including body
 * @param {string[]} [additional] - additional keys which are acceptable
 */
function validateOptions(options, additional) {
    additional ||= [];
    const defaultOptions = [
        'CallsInConversation',
        'Client',
        'ConversationID',
        'Priority',
        'RequestType',
        'SaveOptions',
        'ScheduledTime',
        'SendResponseTo',
        'SequenceCode',
    ];
    for (const key in options) {
        if (![...defaultOptions, ...additional].includes(key)) {
            throw new Error(`${key} is not a supported Option`);
        }
    }
}
