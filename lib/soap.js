'use strict';
const axios = require('axios');
const xmlToJson = require('fast-xml-parser');
const JsonToXml = require('fast-xml-parser').j2xParser;
const { isObject } = require('./util');

module.exports = class Soap {
    /**
     * Constuctor of Soap object
     * @constructor
     * @param {Object} auth Auth object used for initializing
     * @param {Object} eventHandlers collection of handler functions (for examplef or logging)
     */
    constructor(auth, eventHandlers) {
        this.auth = auth;
        this.eventHandlers = eventHandlers;
    }

    /**
     * Method used to retrieve data via SOAP API
     * @param {string} type -SOAP Object type
     * @param {Array<String>} props - Properties which should be retrieved
     * @param {Object} [requestParams] - additional RetrieveRequest parameters, for example filter or options
     * @returns {Promise<Object>} SOAP object converted from XML
     */
    retrieve(type, props, requestParams) {
            const body = {
                RetrieveRequestMsg: {
                    '@_xmlns': 'http://exacttarget.com/wsdl/partnerAPI',
                    RetrieveRequest: {
                        ObjectType: type,
                        Properties: props,
                    },
                },
            };

            if (requestParams) {
                validateOptions(requestParams.options, [
                    'BatchSize',
                    'IncludeObjects',
                    'OnlyIncludeBase',
                ]);
                if (requestParams.options) {
                    body.RetrieveRequestMsg.RetrieveRequest.Options = requestParams.options;
                }
                if (requestParams.ClientIDs) {
                    body.RetrieveRequestMsg.RetrieveRequest.ClientIDs = requestParams.clientIDs;
                }
                // filter can be simple or complex and has three properties leftOperand, rightOperand, and operator
                if (requestParams.filter) {
                    body.RetrieveRequestMsg.RetrieveRequest.Filter = _parseFilter(requestParams.filter);
                }
                if (requestParams.QueryAllAccounts) {
                    body.RetrieveRequestMsg.RetrieveRequest.QueryAllAccounts = true;
                }
                if (requestParams.continueRequest) {
                    body.RetrieveRequestMsg.RetrieveRequest.ContinueRequest =
                        requestParams.continueRequest;
                }
            }

            return _apiRequest(
                this.auth, {
                    action: 'Retrieve',
                    req: body,
                    key: 'RetrieveResponseMsg',
                },
                1
            );
        }
        /**
         * Method used to retrieve all data via SOAP API
         * @param {string} type -SOAP Object type
         * @param {Array<String>} props - Properties which should be retrieved
         * @param {Object} [requestParams] - additional RetrieveRequest parameters, for example filter or options
         * @returns {Promise<Object>} SOAP object converted from XML
         */
    async retrieveBulk(type, props, requestParams) {
            let status;
            let resultsBulk;
            do {
                const resultsBatch = await this.retrieve(type, props, requestParams);
                if (resultsBulk) {
                    // once first batch is done, the follow just add to result payload
                    resultsBulk.Results.push(...resultsBatch.Results);
                } else {
                    resultsBulk = resultsBatch;
                }
                status = resultsBatch.OverallStatus;
                if (status === 'MoreDataAvailable') {
                    requestParams.continueRequest = resultsBatch.RequestID;
                    if (this.eventHandlers && this.eventHandlers.onLoop) {
                        this.eventHandlers.onLoop(type, resultsBulk);
                    }
                }
            } while (status === 'MoreDataAvailable');
            return resultsBulk;
        }
        /**
         * Method used to create data via SOAP API
         * @param {string} type -SOAP Object type
         * @param {Array<String>} props - Properties which should be created
         * @param {Object} options - configuration of the request
         * @returns {Promise<Object>} SOAP object converted from XML
         */
    create(type, props, options) {
            const body = {
                CreateRequest: {
                    '@_xmlns': 'http://exacttarget.com/wsdl/partnerAPI',
                    Options: options,
                    Objects: props,
                },
            };
            body.CreateRequest.Objects['@_xsi:type'] = type;
            validateOptions(options);
            return _apiRequest(
                this.auth, {
                    action: 'Create',
                    req: body,
                    key: 'CreateResponse',
                },
                1
            );
        }
        /**
         * Method used to update data via SOAP API
         * @param {string} type -SOAP Object type
         * @param {Array<String>} props - Properties which should be updated
         * @param {Object} options - configuration of the request
         * @returns {Promise<Object>} SOAP object converted from XML
         */
    update(type, props, options) {
            const body = {
                UpdateRequest: {
                    '@_xmlns': 'http://exacttarget.com/wsdl/partnerAPI',
                    Options: options,
                    Objects: props,
                },
            };
            body.UpdateRequest.Objects['@_xsi:type'] = type;
            validateOptions(options);
            return _apiRequest(
                this.auth, {
                    action: 'Update',
                    req: body,
                    key: 'UpdateResponse',
                },
                1
            );
        }
        /**
         * Method used to delete data via SOAP API
         * @param {string} type -SOAP Object type
         * @param {Array<String>} props - Properties which should be retrieved
         * @param {Object} options - configuration of the request
         * @returns {Promise<Object>} SOAP object converted from XML
         */
    delete(type, props, options) {
            const body = {
                DeleteRequest: {
                    '@_xmlns': 'http://exacttarget.com/wsdl/partnerAPI',
                    Options: options,
                    Objects: props,
                },
            };
            body.DeleteRequest.Objects['@_xsi:type'] = type;
            validateOptions(options);
            return _apiRequest(
                this.auth, {
                    action: 'Delete',
                    req: body,
                    key: 'DeleteResponse',
                },
                1
            );
        }
        /**
         * Method used to schedule data via SOAP API
         * @param {string} type -SOAP Object type
         * @param {Object} schedule -object for what the schedule should be
         * @param {Array|Object} interactions - Object or array of interactions
         * @param {string} action - type of schedul
         * @param {Object} options - configuration of the request
         * @returns {Promise<Object>} SOAP object converted from XML
         */
    schedule(type, schedule, interactions, action, options) {
            const body = {
                ScheduleRequestMsg: {
                    '@_xmlns': 'http://exacttarget.com/wsdl/partnerAPI',
                    Action: action,
                    Options: options,
                    Schedule: schedule,
                    Interactions: interactions,
                },
            };
            if (Array.isArray(body.ScheduleRequestMsg.Interactions)) {
                body.ScheduleRequestMsg.Interactions = body.ScheduleRequestMsg.Interactions.map((i) => {
                    i.Interaction['@_xsi:type'] = type;
                    return i;
                });
            } else if (isObject(body.ScheduleRequestMsg.Interactions)) {
                body.ScheduleRequestMsg.Interactions.Interaction['@_xsi:type'] = type;
            } else {
                throw new TypeError('Interactions must be of Array or Object Type');
            }
            validateOptions(options);
            return _apiRequest(
                this.auth, {
                    action: 'Schedule',
                    req: body,
                    key: 'ScheduleResponse',
                },
                1
            );
        }
        /**
         * Method used to describe metadata via SOAP API
         * @param {string} type -SOAP Object type
         * @returns {Promise<Object>} SOAP object converted from XML
         */
    describe(type) {
            return _apiRequest(
                this.auth, {
                    action: 'Describe',
                    req: {
                        DefinitionRequestMsg: {
                            '@_xmlns': 'http://exacttarget.com/wsdl/partnerAPI',
                            DescribeRequests: {
                                ObjectDefinitionRequest: {
                                    ObjectType: type,
                                },
                            },
                        },
                    },
                    key: 'DefinitionResponseMsg',
                },
                1
            );
        }
        /**
         * Method used to execute data via SOAP API
         * @param {string} type -SOAP Object type
         * @param {Array<String>} props - Properties which should be retrieved
         * @returns {Promise<Object>} SOAP object converted from XML
         */
    execute(type, props) {
            return _apiRequest(
                this.auth, {
                    action: 'Execute',
                    req: {
                        ExecuteRequestMsg: {
                            '@_xmlns': 'http://exacttarget.com/wsdl/partnerAPI',
                            Requests: {
                                Name: type,
                                Parameters: props,
                            },
                        },
                    },
                    key: 'ExecuteResponseMsg',
                },
                1
            );
        }
        /**
         * Method used to execute data via SOAP API
         * @param {string} type -SOAP Object type
         * @param {Array<String>} props - Properties which should be retrieved
         * @returns {Promise<Object>} SOAP object converted from XML
         */
    perform(type) {
        return _apiRequest(
            this.auth, {
                action: 'perform',
                req: {
                    PerformRequestMsg: {
                        '@_xmlns': 'http://exacttarget.com/wsdl/partnerAPI',
                        Action: 'start',
                        Definitions: [{
                            Definition: {
                                '@_xsi:type': type,
                            },
                        }, ],
                    },
                },
                key: 'PerformResponseMsg',
            },
            1
        );
    }
};
/**
 * Method to build the payload then conver to XML
 * @param {Object} request Object form of the payload
 * @param {string} token access token for authentication
 * @return {Promise<String>} XML string payload
 */
function _buildEnvelope(request, token) {
    const jsonToXml = new JsonToXml({ ignoreAttributes: false });
    return jsonToXml.parse({
        Envelope: {
            Body: request,
            '@_xmlns': 'http://schemas.xmlsoap.org/soap/envelope/',
            '@_xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
            Header: {
                fueloauth: {
                    '@_xmlns': 'http://exacttarget.com',
                    '#text': token,
                },
            },
        },
    });
}

/**
 * Method to filter requests in SOAP
 * @param {Object} filter Polymorphic filter object
 * @return {Object} formatted filter object
 */
function _parseFilter(filter) {
    let filterType = 'Simple';
    const obj = {};

    if (isObject(filter.leftOperand) && isObject(filter.rightOperand)) {
        filterType = 'Complex';
    }

    switch (filterType.toLowerCase()) {
        case 'simple':
            obj.Property = filter.leftOperand;
            obj.SimpleOperator = filter.operator;
            obj.Value = filter.rightOperand;
            break;
        case 'complex':
            obj.LeftOperand = _parseFilter(filter.leftOperand);
            obj.LogicalOperator = filter.operator;
            obj.RightOperand = _parseFilter(filter.rightOperand);
            break;
    }

    obj['@_xsi:type'] = filterType + 'FilterPart';

    return obj;
}
/**
 * Method to parse the XML response
 * @param {string} body payload in XML format
 * @param {string} key key of the expected response body
 * @return {Promise<Object|Error>} Result of request in Object format
 */
async function _parseResponse(body, key) {
    // const parser = new xml2js.Parser({
    //     trim: true,
    //     normalize: true,
    //     explicitArray: false,
    //     ignoreAttrs: true,
    // });

    // const payload = await parser.parseStringPromise(body);
    const payload = xmlToJson.parse(body);

    const soapBody = payload['soap:Envelope']['soap:Body'];
    // checks errors in Body Fault
    if (soapBody['soap:Fault']) {
        const fault = soapBody['soap:Fault'];
        const soapError = new Error(fault.faultstring);
        soapError.faultMessage = fault.faultstring;
        soapError.faultCode = fault.faultcode;

        if (fault.detail) {
            soapError.detail = fault.detail;
        }
        throw soapError;
    }

    // checks overall status error
    if (payload.OverallStatus === 'Error' || payload.OverallStatus === 'Has Errors') {
        const soapError = new Error('Soap Error');
        soapError.requestId = payload.RequestID;
        soapError.results = payload.Results;
        soapError.errorPropagatedFrom = key;
        throw soapError;
    }
    // These should always be run no matter the execution
    // Results should always be an array
    if (isObject(soapBody[key].Results)) {
        soapBody[key].Results = [soapBody[key].Results];
    }
    // retrieve parse
    if (['CreateResponse', 'RetrieveResponseMsg', 'UpdateResponse'].includes(key)) {
        if (
            soapBody[key].OverallStatus === 'OK' ||
            soapBody[key].OverallStatus === 'MoreDataAvailable'
        ) {
            return soapBody[key];
        } else {
            // This is an error
            const errorType = soapBody[key].OverallStatus.includes(':') ?
                soapBody[key].OverallStatus.split(':')[1].trim() :
                soapBody[key].OverallStatus;
            const soapError = new Error(errorType);
            soapError.requestId = soapBody[key].RequestID;
            soapError.errorPropagatedFrom = key;
            throw soapError;
        }
    }

    // default return
    return soapBody;
}
/**
 * Method that makes the api request
 * @param {Object} auth - Auth Object used to make request
 * @param {Object} options configuration for the request including body
 * @param {number} remainingAttempts number of times this request should be reattempted in case of error
 * @returns {Promise<Object>} Results from the SOAP request in Object format
 */
async function _apiRequest(auth, options, remainingAttempts) {
    if (!isObject(options)) {
        throw new TypeError('options argument is required');
    }
    try {
        await auth.getAccessToken();
        const requestOptions = {
            method: 'POST',
            baseURL: auth.options.soap_instance_url,
            url: '/Service.asmx',
            headers: {
                SOAPAction: options.action,
                'Content-Type': 'text/xml',
            },
            data: _buildEnvelope(options.req, auth.options.access_token),
        };

        const res = await axios(requestOptions);
        return _parseResponse(res.data, options.key);
    } catch (ex) {
        if (ex.response && [404, 596].includes(Number(ex.response.status)) && remainingAttempts) {
            // force refresh due to url related issue
            await auth.getAccessToken(true);
            return _apiRequest(auth, options, remainingAttempts--);
        }
        throw ex;
    }
}
/**
 * Method checks options object for validity
 * @param {Object} options configuration for the request including body
 * @param {Array<String>} additional - additional keys which are acceptable
 * @returns {Void} throws error if not supported
 */
function validateOptions(options, additional) {
    additional = additional || [];
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
        if (!defaultOptions.concat(additional).includes(key)) {
            throw new Error(`${key} is not a supported Option`);
        }
    }
}