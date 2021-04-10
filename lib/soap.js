'use strict';
const axios = require('axios');
const xml2js = require('xml2js');
const { isObject } = require('./util');

module.exports = class Soap {
    /**
     * Constuctor of Soap object
     * @constructor
     * @param {Object} auth Auth object used for initializing
     */
    constructor(auth) {
        this.auth = auth;
    }

    /**
     * Method used to retrieve data via SOAP API
     * @param {String} type -SOAP Object type
     * @param {Array<String>} props - Properties which should be retrieved
     * @param {Object} options - configuration of the request
     * @param {Array<Number>} [clientIDs] - MIDs which should be added to the request payload
     * @returns {Promise<Object>} SOAP object converted from XML
     */
    retrieve(type, props, options, clientIDs) {
        // const defaults = {
        //     paginate: false,
        // };
        const body = {
            RetrieveRequestMsg: {
                $: {
                    xmlns: 'http://exacttarget.com/wsdl/partnerAPI',
                },
                RetrieveRequest: {
                    ObjectType: type,
                    Properties: props,
                },
            },
        };
        if (clientIDs) {
            body.RetrieveRequestMsg.RetrieveRequest.ClientIDs = clientIDs;
        }
        // filter can be simple or complex and has three properties leftOperand, rightOperand, and operator
        if (options.filter) {
            body.RetrieveRequestMsg.RetrieveRequest.Filter = _parseFilter(options.filter);
        }

        if (options.queryAllAccounts) {
            body.RetrieveRequestMsg.RetrieveRequest.QuertAllAccounts = true;
        }
        // TODO continueRequest + Pagination
        return _apiRequest(
            this.auth,
            {
                action: 'Retrieve',
                req: body,
                key: 'RetrieveResponseMsg',
            },
            1
        );
    }
};
/**
 * Method to build the payload then conver to XML
 * @param {Object} request Object form of the payload
 * @param {String} token access token for authentication
 * @return {Promise<String>} XML string payload
 */
function _buildEnvelope(request, token) {
    const builder = new xml2js.Builder({
        rootName: 'Envelope',
        headless: true,
    });
    return builder.buildObject({
        Body: request,
        $: {
            xmlns: 'http://schemas.xmlsoap.org/soap/envelope/',
            'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        },
        Header: {
            fueloauth: {
                $: {
                    xmlns: 'http://exacttarget.com',
                },
                _: token,
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

    obj.$ = { 'xsi:type': filterType + 'FilterPart' };

    return obj;
}
/**
 * Method to parse the XML response
 * @param {String} body payload in XML format
 * @param {String} key key of the expected response body
 * @return {Promise<Object|Error>} Result of request in Object format
 */
async function _parseResponse(body, key) {
    const parser = new xml2js.Parser({
        trim: true,
        normalize: true,
        explicitArray: false,
        ignoreAttrs: true,
    });

    const payload = await parser.parseStringPromise(body);
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
    // retrieve parse
    if (key === 'RetrieveResponseMsg') {
        if (
            soapBody[key].OverallStatus === 'OK' ||
            soapBody[key].OverallStatus === 'MoreDataAvailable'
        ) {
            return soapBody[key];
        } else {
            // This is an error
            const soapError = new Error(soapBody[key].OverallStatus.split(':')[1].trim());
            soapError.requestId = soapBody[key].RequestID;
            soapError.errorPropagatedFrom = 'Retrieve Response';
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
 * @param {Number} remainingAttempts number of times this request should be reattempted in case of error
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
        console.error(ex.message, ex.response);
        console.error(options);
    }
}
