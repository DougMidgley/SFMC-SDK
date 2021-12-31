'use strict';
const axios = require('axios');
const xmlToJson = require('fast-xml-parser');
const JsonToXml = require('fast-xml-parser').j2xParser;
const { isObject } = require('./util');

module.exports = class Soap {
    /**
     * Constuctor of Soap object
     *
     * @function Object() { [native code] }
     * @param {object} auth Auth object used for initializing
     * @param {object} eventHandlers collection of handler functions (for examplef or logging)
     */
    constructor(auth, eventHandlers) {
        this.auth = auth;
        this.eventHandlers = eventHandlers;
    }

    /**
     * Method used to retrieve data via SOAP API
     *
     * @param {string} type -SOAP Object type
     * @param {Array<string>} props - Properties which should be retrieved
     * @param {object} [requestParams] - additional RetrieveRequest parameters, for example filter or options
     * @returns {Promise<object>} SOAP object converted from XML
     */
    retrieve(type, props, requestParams) {
        if (!type) {
            throw new Error('Retrieve requires a type');
        }
        if (!Array.isArray(props)) {
            throw new Error('Retrieve request requires one or more properties');
        }
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

        return this._apiRequest(
            this.auth,
            {
                action: 'Retrieve',
                req: body,
                key: 'RetrieveResponseMsg',
            },
            1
        );
    }
    /**
     * Method used to retrieve all data via SOAP API
     *
     * @param {string} type -SOAP Object type
     * @param {Array<string>} props - Properties which should be retrieved
     * @param {object} [requestParams] - additional RetrieveRequest parameters, for example filter or options
     * @returns {Promise<object>} SOAP object converted from XML
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
     *
     * @param {string} type -SOAP Object type
     * @param {Array<string>} props - Properties which should be created
     * @param {object} [requestParams] - additional RetrieveRequest parameters, for example filter or options
     * @returns {Promise<object>} SOAP object converted from XML
     */
    create(type, props, requestParams) {
        if (!type) {
            throw new Error('Create requires a type');
        }
        if (Object.keys(props).length == 0) {
            throw new Error('Create request requires one or more properties');
        }
        validateOptions(requestParams?.options);
        const body = {
            CreateRequest: {
                '@_xmlns': 'http://exacttarget.com/wsdl/partnerAPI',
                Options: requestParams?.options,
                Objects: props,
            },
        };
        body.CreateRequest.Objects['@_xsi:type'] = type;
        return this._apiRequest(
            this.auth,
            {
                action: 'Create',
                req: body,
                key: 'CreateResponse',
            },
            1
        );
    }
    /**
     * Method used to update data via SOAP API
     *
     * @param {string} type -SOAP Object type
     * @param {Array<string>} props - Properties which should be updated
     * @param {object} [requestParams] - additional RetrieveRequest parameters, for example filter or options
     * @returns {Promise<object>} SOAP object converted from XML
     */
    update(type, props, requestParams) {
        if (!type) {
            throw new Error('Update requires a type');
        }
        if (Object.keys(props).length == 0) {
            throw new Error('Update request requires one or more properties');
        }
        validateOptions(requestParams?.options);
        const body = {
            UpdateRequest: {
                '@_xmlns': 'http://exacttarget.com/wsdl/partnerAPI',
                Options: requestParams?.options,
                Objects: props,
            },
        };
        body.UpdateRequest.Objects['@_xsi:type'] = type;

        return this._apiRequest(
            this.auth,
            {
                action: 'Update',
                req: body,
                key: 'UpdateResponse',
            },
            1
        );
    }
    /**
     * Method used to delete data via SOAP API
     *
     * @param {string} type -SOAP Object type
     * @param {Array<string>} props - Properties which should be retrieved
     * @param {object} [requestParams] - additional RetrieveRequest parameters, for example filter or options
     * @returns {Promise<object>} SOAP object converted from XML
     */
    delete(type, props, requestParams) {
        if (!type) {
            throw new Error('Delete requires a type');
        }
        if (Object.keys(props).length == 0) {
            throw new Error('Delete request requires one or more properties');
        }
        validateOptions(requestParams?.options);
        const body = {
            DeleteRequest: {
                '@_xmlns': 'http://exacttarget.com/wsdl/partnerAPI',
                Options: requestParams?.options,
                Objects: props,
            },
        };
        body.DeleteRequest.Objects['@_xsi:type'] = type;
        return this._apiRequest(
            this.auth,
            {
                action: 'Delete',
                req: body,
                key: 'DeleteResponse',
            },
            1
        );
    }
    /**
     * Method used to schedule data via SOAP API
     *
     * @param {string} type -SOAP Object type
     * @param {object} schedule -object for what the schedule should be
     * @param {Array | object} interactions - Object or array of interactions
     * @param {string} action - type of schedule
     * @param {object} [options] -additional options for the request
     * @returns {Promise<object>} SOAP object converted from XML
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
        return this._apiRequest(
            this.auth,
            {
                action: 'Schedule',
                req: body,
                key: 'ScheduleResponseMsg',
            },
            1
        );
    }
    /**
     * Method used to describe metadata via SOAP API
     *
     * @param {string} type -SOAP Object type
     * @returns {Promise<object>} SOAP object converted from XML
     */
    describe(type) {
        if (!type) {
            throw new Error('Describe requires a type');
        }
        return this._apiRequest(
            this.auth,
            {
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
     *
     * @param {string} type -SOAP Object type
     * @param {Array<string>} props - Properties which should be retrieved
     * @returns {Promise<object>} SOAP object converted from XML
     */
    execute(type, props) {
        if (!type) {
            throw new Error('Execute requires a type');
        }
        return this._apiRequest(
            this.auth,
            {
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
     *
     * @param {string} type -SOAP Object type
     * @param {string} action - type of action, for example 'Start'
     * @param {object} payload - relevant payload to perform, for example query Definition
     * @returns {Promise<object>} SOAP object converted from XML
     */
    perform(type, action, payload) {
        if (!type) {
            throw new Error('Peform requires a type');
        }
        if (!payload) {
            throw new Error('Peform requires a payload, for example and Array of ObjectIDs');
        }
        const def = Object.assign(
            {
                '@_xsi:type': type,
            },
            payload
        );
        return this._apiRequest(
            this.auth,
            {
                action: 'Perform',
                req: {
                    PerformRequestMsg: {
                        '@_xmlns': 'http://exacttarget.com/wsdl/partnerAPI',
                        Action: action,
                        Definitions: [
                            {
                                Definition: def,
                            },
                        ],
                    },
                },
                key: 'PerformResponseMsg',
            },
            1
        );
    }
    /**
     * Method that makes the api request
     *
     * @param {object} auth - Auth Object used to make request
     * @param {object} options configuration for the request including body
     * @param {number} remainingAttempts number of times this request should be reattempted in case of error
     * @returns {Promise<object>} Results from the SOAP request in Object format
     */
    async _apiRequest(auth, options, remainingAttempts) {
        if (!isObject(options)) {
            throw new TypeError('options argument is required');
        }

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
        if (this.eventHandlers?.logRequest) {
            this.eventHandlers.logRequest(requestOptions);
        }
        let response;
        try {
            response = await axios(requestOptions);
        } catch (requestEx) {
            if (requestEx.response) {
                response = requestEx.response;
            } else {
                throw requestEx;
            }
        }
        if (this.eventHandlers?.logResponse) {
            this.eventHandlers.logResponse({
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
        } catch (ex) {
            if (ex.errorMessage === 'Token Expired' && remainingAttempts) {
                // force refresh due to url related issue
                await auth.getAccessToken(true);
                remainingAttempts--;
                return this._apiRequest(auth, options, remainingAttempts);
            } else {
                throw ex;
            }
        }
    }
};
/**
 * Method to build the payload then conver to XML
 *
 * @param {object} request Object form of the payload
 * @param {string} token access token for authentication
 * @returns {Promise<string>} XML string payload
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
 *
 * @param {object} filter Polymorphic filter object
 * @returns {object} formatted filter object
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
 *
 * @param {string} response  payload including whole SOAP response
 * @param {string} key key of the expected response body
 * @returns {Promise<object | Error>} Result of request in Object format
 */
async function _parseResponse(response, key) {
    const soapBody = xmlToJson.parse(response.data)?.['soap:Envelope']?.['soap:Body'];
    if (soapBody?.[key]) {
        // These should always be run no matter the execution
        // Results should always be an array
        if (isObject(soapBody[key].Results)) {
            soapBody[key].Results = [soapBody[key].Results];
        }
        // checks overall status error
        if (['Error', 'Has Errors'].includes(soapBody[key].OverallStatus)) {
            throw new SOAPError(response, soapBody[key]);
        }
        return soapBody[key];
    }
    throw new SOAPError(response, soapBody);
}
/**
 * Method checks options object for validity
 *
 * @param {object} options configuration for the request including body
 * @param {Array<string>} additional - additional keys which are acceptable
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

class SOAPError extends Error {
    constructor(response, soapBody) {
        // Content Error
        if (soapBody && ['Error', 'Has Errors'].includes(soapBody.OverallStatus)) {
            super('One or more errors in the Results');
        }
        // Payload Error
        else if (soapBody && soapBody['soap:Fault']) {
            super('Error in SOAP Payload');
            const fault = soapBody['soap:Fault'];
            this.errorCode = fault.faultcode;
            this.errorMessage = fault.faultstring;
        }
        // Request Error
        else if (response.status > 299) {
            super('Error with SOAP Request');
        }
        // Fallback Error
        else {
            console.log(soapBody);
            super('Unknown Error or Unhandled Request');
        }
        this.response = response;
        this.JSON = soapBody;
    }
}
