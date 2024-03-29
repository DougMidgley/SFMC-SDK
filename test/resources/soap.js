export const retrieveDataExtension = {
    response:
        '<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:wsa="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd"><soap:Header><wsa:Action>RetrieveResponse</wsa:Action><wsa:MessageID>urn:uuid:4a9be7d8-0644-4998-86c0-16f47a7ee415</wsa:MessageID><wsa:RelatesTo>urn:uuid:18e38997-db05-4571-a4b3-24a7308ab6b1</wsa:RelatesTo><wsa:To>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</wsa:To><wsse:Security><wsu:Timestamp wsu:Id="Timestamp-c9b423e5-9274-45b5-865e-332e8040fa7a"><wsu:Created>2021-12-29T21:27:30Z</wsu:Created><wsu:Expires>2021-12-29T21:32:30Z</wsu:Expires></wsu:Timestamp></wsse:Security></soap:Header><soap:Body><RetrieveResponseMsg xmlns="http://exacttarget.com/wsdl/partnerAPI"><OverallStatus>OK</OverallStatus><RequestID>f06cc504-68bf-4db8-9141-e420ed248e72</RequestID><Results xsi:type="DataExtension"><PartnerKey xsi:nil="true" /><ObjectID xsi:nil="true" /><CustomerKey>DC91A414-6240-48BC-BB89-7F3910D41580</CustomerKey></Results></RetrieveResponseMsg></soap:Body></soap:Envelope>',
    parsed: {
        OverallStatus: 'OK',
        RequestID: 'f06cc504-68bf-4db8-9141-e420ed248e72',
        Results: [
            {
                PartnerKey: '',
                ObjectID: '',
                CustomerKey: 'DC91A414-6240-48BC-BB89-7F3910D41580',
            },
        ],
    },
    status: 200,
    action: 'Retrieve',
};
export const retrieveBulkDataExtension = {
    response:
        '<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:wsa="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd"><soap:Header><wsa:Action>RetrieveResponse</wsa:Action><wsa:MessageID>urn:uuid:4a9be7d8-0644-4998-86c0-16f47a7ee415</wsa:MessageID><wsa:RelatesTo>urn:uuid:18e38997-db05-4571-a4b3-24a7308ab6b1</wsa:RelatesTo><wsa:To>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</wsa:To><wsse:Security><wsu:Timestamp wsu:Id="Timestamp-c9b423e5-9274-45b5-865e-332e8040fa7a"><wsu:Created>2021-12-29T21:27:30Z</wsu:Created><wsu:Expires>2021-12-29T21:32:30Z</wsu:Expires></wsu:Timestamp></wsse:Security></soap:Header><soap:Body><RetrieveResponseMsg xmlns="http://exacttarget.com/wsdl/partnerAPI"><OverallStatus>MoreDataAvailable</OverallStatus><RequestID>f06cc504-68bf-4db8-9141-e420ed248e72</RequestID><Results xsi:type="DataExtension"><PartnerKey xsi:nil="true" /><ObjectID xsi:nil="true" /><CustomerKey>DC91A414-6240-48BC-BB89-7F3910D41580</CustomerKey></Results></RetrieveResponseMsg></soap:Body></soap:Envelope>',
    parsed: {
        OverallStatus: 'MoreDataAvailable',
        RequestID: 'f06cc504-68bf-4db8-9141-e420ed248e72',
        Results: [
            {
                PartnerKey: '',
                ObjectID: '',
                CustomerKey: 'DC91A414-6240-48BC-BB89-7F3910D41580',
            },
        ],
    },
    status: 200,
    action: 'Retrieve',
};
export const subscriberFailed = {
    action: 'Create',
    status: 200,
    response:
        '<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:wsa="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd"><soap:Header><wsa:Action>CreateResponse</wsa:Action><wsa:MessageID>urn:uuid:4f0a1ff2-1967-45af-b709-5ffd50ecbe96</wsa:MessageID><wsa:RelatesTo>urn:uuid:d78f77be-0e99-48f1-8b99-75b6dc7ca74a</wsa:RelatesTo><wsa:To>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</wsa:To><wsse:Security><wsu:Timestamp wsu:Id="Timestamp-74e7bfc4-ba66-4465-9a6a-55cdbd04ded4"><wsu:Created>2021-12-30T12:00:06Z</wsu:Created><wsu:Expires>2021-12-30T12:05:06Z</wsu:Expires></wsu:Timestamp></wsse:Security></soap:Header><soap:Body><CreateResponse xmlns="http://exacttarget.com/wsdl/partnerAPI"><Results><StatusCode>Error</StatusCode><StatusMessage>The subscriber is already on the list</StatusMessage><OrdinalID>0</OrdinalID><ErrorCode>12014</ErrorCode><NewID>0</NewID><Object xsi:type="Subscriber"><PartnerKey xsi:nil="true" /><ObjectID xsi:nil="true" /><EmailAddress>doug@accenture.com</EmailAddress><SubscriberKey>12345123</SubscriberKey></Object></Results><RequestID>d27a9b96-e21e-4c17-9ff5-ba1e3c81da29</RequestID><OverallStatus>Error</OverallStatus></CreateResponse></soap:Body></soap:Envelope>',
    parsed: {
        Results: [
            {
                StatusCode: 'Error',
                StatusMessage: 'The subscriber is already on the list',
                OrdinalID: 0,
                ErrorCode: 12014,
                NewID: 0,
                Object: {
                    PartnerKey: '',
                    ObjectID: '',
                    EmailAddress: 'doug@accenture.com',
                    SubscriberKey: 12345123,
                },
            },
        ],
        RequestID: 'd27a9b96-e21e-4c17-9ff5-ba1e3c81da29',
        OverallStatus: 'Error',
    },
};
export const subscriberCreated = {
    status: 200,
    action: 'Create',
    response:
        '<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:wsa="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd"><soap:Header><wsa:Action>CreateResponse</wsa:Action><wsa:MessageID>urn:uuid:cdfcc696-fe11-424b-b873-17518280f61f</wsa:MessageID><wsa:RelatesTo>urn:uuid:a53c4da8-6595-4090-819f-4407e17149cb</wsa:RelatesTo><wsa:To>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</wsa:To><wsse:Security><wsu:Timestamp wsu:Id="Timestamp-a53e785d-e1fa-40c9-8ce2-5d7b85bc84b5"><wsu:Created>2021-12-30T12:09:58Z</wsu:Created><wsu:Expires>2021-12-30T12:14:58Z</wsu:Expires></wsu:Timestamp></wsse:Security></soap:Header><soap:Body><CreateResponse xmlns="http://exacttarget.com/wsdl/partnerAPI"><Results><StatusCode>OK</StatusCode><StatusMessage>Created Subscriber.</StatusMessage><OrdinalID>0</OrdinalID><NewID>756891044</NewID><Object xsi:type="Subscriber"><PartnerKey xsi:nil="true" /><ID>756891044</ID><ObjectID xsi:nil="true" /><EmailAddress>douglas@accenture.com</EmailAddress><SubscriberKey>1234512345</SubscriberKey></Object></Results><RequestID>46a1b17e-3e03-47bd-92e0-fbbfa70024b9</RequestID><OverallStatus>OK</OverallStatus></CreateResponse></soap:Body></soap:Envelope>',
    parsed: {
        Results: [
            {
                StatusCode: 'OK',
                StatusMessage: 'Created Subscriber.',
                OrdinalID: 0,
                NewID: 756891044,
                Object: {
                    PartnerKey: '',
                    ID: 756891044,
                    ObjectID: '',
                    EmailAddress: 'douglas@accenture.com',
                    SubscriberKey: 1234512345,
                },
            },
        ],
        RequestID: '46a1b17e-3e03-47bd-92e0-fbbfa70024b9',
        OverallStatus: 'OK',
    },
};
export const subscriberUpdated = {
    status: 200,
    action: 'Update',
    response:
        '<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:wsa="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd"><soap:Header><wsa:Action>UpdateResponse</wsa:Action><wsa:MessageID>urn:uuid:1bfe8c01-212d-4fdf-aa30-340746b40e96</wsa:MessageID><wsa:RelatesTo>urn:uuid:a777c076-d076-4501-8671-8a605478ac4c</wsa:RelatesTo><wsa:To>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</wsa:To><wsse:Security><wsu:Timestamp wsu:Id="Timestamp-4fae36df-6730-4833-8d34-76fabdf0afdb"><wsu:Created>2021-12-30T12:12:57Z</wsu:Created><wsu:Expires>2021-12-30T12:17:57Z</wsu:Expires></wsu:Timestamp></wsse:Security></soap:Header><soap:Body><UpdateResponse xmlns="http://exacttarget.com/wsdl/partnerAPI"><Results><StatusCode>OK</StatusCode><StatusMessage>Updated Subscriber.</StatusMessage><OrdinalID>0</OrdinalID><Object xsi:type="Subscriber"><PartnerKey xsi:nil="true" /><ID>756891044</ID><ObjectID xsi:nil="true" /><EmailAddress>douglas@accenture.com</EmailAddress><SubscriberKey>1234512345</SubscriberKey></Object></Results><RequestID>5dda05c1-9725-4b65-99a2-61d503fc17d9</RequestID><OverallStatus>OK</OverallStatus></UpdateResponse></soap:Body></soap:Envelope>',
    parsed: {
        Results: [
            {
                StatusCode: 'OK',
                StatusMessage: 'Updated Subscriber.',
                OrdinalID: 0,
                Object: {
                    PartnerKey: '',
                    ID: 756891044,
                    ObjectID: '',
                    EmailAddress: 'douglas@accenture.com',
                    SubscriberKey: 1234512345,
                },
            },
        ],
        RequestID: '5dda05c1-9725-4b65-99a2-61d503fc17d9',
        OverallStatus: 'OK',
    },
};
export const expiredToken = {
    action: 'Create',
    status: 500,
    response:
        '<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:wsa="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd"><soap:Header><wsa:Action>http://schemas.xmlsoap.org/ws/2004/08/addressing/fault</wsa:Action><wsa:MessageID>urn:uuid:d9cf5a28-7f43-4001-88bc-ab9bb7f7ab17</wsa:MessageID><wsa:RelatesTo>urn:uuid:335671b2-16a9-41cf-9758-bb54b1282c57</wsa:RelatesTo><wsa:To>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</wsa:To><wsse:Security><wsu:Timestamp wsu:Id="Timestamp-9b3dfbe2-c605-4c0e-8231-14ab75114692"><wsu:Created>2021-12-29T21:53:23Z</wsu:Created><wsu:Expires>2021-12-29T21:58:23Z</wsu:Expires></wsu:Timestamp></wsse:Security></soap:Header><soap:Body><soap:Fault><faultcode xmlns:q0="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">q0:Security</faultcode><faultstring>Token Expired</faultstring><faultactor>https://mct0l7nxfq2r988t1kxfy8sc47ma.soap.marketingcloudapis.com/Service.asmx</faultactor></soap:Fault></soap:Body></soap:Envelope>',
};
export const noObjectHandlerFound = {
    action: 'Retrieve',
    status: 200,
    response:
        '<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:wsa="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd"><soap:Header><wsa:Action>RetrieveResponse</wsa:Action><wsa:MessageID>urn:uuid:1359544f-87c6-478f-bccb-8d3fbfc67e3e</wsa:MessageID><wsa:RelatesTo>urn:uuid:4cd19e58-9de8-4f8f-80a5-21f7c4e0f288</wsa:RelatesTo><wsa:To>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</wsa:To><wsse:Security><wsu:Timestamp wsu:Id="Timestamp-af3896d3-28d4-466c-b84c-d9914ef8eefa"><wsu:Created>2022-12-09T13:08:14Z</wsu:Created><wsu:Expires>2022-12-09T13:13:14Z</wsu:Expires></wsu:Timestamp></wsse:Security></soap:Header><soap:Body><RetrieveResponseMsg xmlns="http://exacttarget.com/wsdl/partnerAPI"><OverallStatus>Error: Unable to find a handler for object type: DeliveryProfile. Object types are case-sensitive, check spelling.</OverallStatus><RequestID>e4737030-0105-4756-b4eb-286dfb25424f</RequestID></RetrieveResponseMsg></soap:Body></soap:Envelope>',
};
export const subscriberDeleted = {
    action: 'Delete',
    status: 200,
    response:
        '<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:wsa="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd"><soap:Header><wsa:Action>DeleteResponse</wsa:Action><wsa:MessageID>urn:uuid:6b498333-274c-4e89-96f6-6281911a4214</wsa:MessageID><wsa:RelatesTo>urn:uuid:3ed645f1-edfa-4f87-b044-ed721843aca6</wsa:RelatesTo><wsa:To>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</wsa:To><wsse:Security><wsu:Timestamp wsu:Id="Timestamp-f8145ab4-8e6b-4174-9b7a-ed8213a87a81"><wsu:Created>2021-12-30T12:47:26Z</wsu:Created><wsu:Expires>2021-12-30T12:52:26Z</wsu:Expires></wsu:Timestamp></wsse:Security></soap:Header><soap:Body><DeleteResponse xmlns="http://exacttarget.com/wsdl/partnerAPI"><Results><StatusCode>OK</StatusCode><StatusMessage>Subscriber deleted</StatusMessage><OrdinalID>0</OrdinalID></Results><RequestID>927a7640-edda-400c-91dd-8691a1fc0720</RequestID><OverallStatus>OK</OverallStatus></DeleteResponse></soap:Body></soap:Envelope>',
    parsed: {
        Results: [{ StatusCode: 'OK', StatusMessage: 'Subscriber deleted', OrdinalID: 0 }],
        RequestID: '927a7640-edda-400c-91dd-8691a1fc0720',
        OverallStatus: 'OK',
    },
};
export const subscriberDescribed = {
    action: 'Describe',
    status: 200,
    response:
        '<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:wsa="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd"><soap:Header><wsa:Action>DescribeResponse</wsa:Action><wsa:MessageID>urn:uuid:c9084023-4024-4637-8410-e1276297c391</wsa:MessageID><wsa:RelatesTo>urn:uuid:1b97a572-ca35-4bb1-899b-ddfdd1509647</wsa:RelatesTo><wsa:To>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</wsa:To><wsse:Security><wsu:Timestamp wsu:Id="Timestamp-ca5550be-b4e3-47b3-be75-e5d928c5c7fb"><wsu:Created>2021-12-30T12:51:30Z</wsu:Created><wsu:Expires>2021-12-30T12:56:30Z</wsu:Expires></wsu:Timestamp></wsse:Security></soap:Header><soap:Body><DefinitionResponseMsg xmlns="http://exacttarget.com/wsdl/partnerAPI"><ObjectDefinition><ObjectType>Subscriber</ObjectType><Properties><PartnerKey xsi:nil="true" /><ObjectID xsi:nil="true" /><Name>ID</Name><DataType>Int32</DataType><IsUpdatable>true</IsUpdatable><IsRetrievable>true</IsRetrievable><IsRequired>true</IsRequired></Properties><Properties><PartnerKey xsi:nil="true" /><ObjectID xsi:nil="true" /><Name>PartnerKey</Name><DataType>String</DataType><IsUpdatable>true</IsUpdatable><IsRetrievable>true</IsRetrievable><MaxLength>64</MaxLength><IsRequired>false</IsRequired></Properties><Properties><PartnerKey xsi:nil="true" /><ObjectID xsi:nil="true" /><Name>CreatedDate</Name><DataType>DateTime</DataType><IsUpdatable>true</IsUpdatable><IsRetrievable>true</IsRetrievable><IsRequired>false</IsRequired></Properties><Properties><PartnerKey xsi:nil="true" /><ObjectID xsi:nil="true" /><Name>Client.ID</Name><DataType>Int32</DataType><IsUpdatable>true</IsUpdatable><IsRetrievable>true</IsRetrievable><IsRequired>true</IsRequired></Properties><Properties><PartnerKey xsi:nil="true" /><ObjectID xsi:nil="true" /><Name>Client.PartnerClientKey</Name><DataType>String</DataType><IsUpdatable>true</IsUpdatable><IsRetrievable>true</IsRetrievable><MaxLength>64</MaxLength><IsRequired>false</IsRequired></Properties><Properties><PartnerKey xsi:nil="true" /><ObjectID xsi:nil="true" /><Name>EmailAddress</Name><DataType>String</DataType><IsUpdatable>true</IsUpdatable><IsRetrievable>true</IsRetrievable><MaxLength>254</MaxLength><IsRequired>true</IsRequired></Properties><Properties><PartnerKey xsi:nil="true" /><ObjectID xsi:nil="true" /><Name>SubscriberKey</Name><DataType>String</DataType><IsUpdatable>true</IsUpdatable><IsRetrievable>true</IsRetrievable><MaxLength>254</MaxLength><IsRequired>true</IsRequired></Properties><Properties><PartnerKey xsi:nil="true" /><ObjectID xsi:nil="true" /><Name>UnsubscribedDate</Name><DataType>DateTime</DataType><IsUpdatable>true</IsUpdatable><IsRetrievable>true</IsRetrievable><IsRequired>false</IsRequired></Properties><Properties><PartnerKey xsi:nil="true" /><ObjectID xsi:nil="true" /><Name>Status</Name><DataType>SubscriberStatus</DataType><IsUpdatable>true</IsUpdatable><IsRetrievable>true</IsRetrievable><IsRequired>true</IsRequired></Properties><Properties><PartnerKey xsi:nil="true" /><ObjectID xsi:nil="true" /><Name>EmailTypePreference</Name><DataType>EmailType</DataType><IsUpdatable>true</IsUpdatable><IsRetrievable>true</IsRetrievable><IsRequired>true</IsRequired></Properties><Properties><PartnerKey xsi:nil="true" /><ObjectID xsi:nil="true" /><Name>Attributes</Name><DataType>Attribute[]</DataType><IsUpdatable>true</IsUpdatable><IsRetrievable>false</IsRetrievable></Properties><Properties><PartnerKey xsi:nil="true" /><ObjectID xsi:nil="true" /><Name>PartnerType</Name><DataType>String</DataType><IsUpdatable>true</IsUpdatable><IsRetrievable>false</IsRetrievable></Properties><Properties><PartnerKey xsi:nil="true" /><ObjectID xsi:nil="true" /><Name>Lists</Name><DataType>SubscriberList[]</DataType><IsUpdatable>true</IsUpdatable><IsRetrievable>false</IsRetrievable></Properties><Properties><PartnerKey xsi:nil="true" /><ObjectID xsi:nil="true" /><Name>GlobalUnsubscribeCategory</Name><DataType>GlobalUnsubscribeCategory</DataType><IsUpdatable>true</IsUpdatable><IsRetrievable>false</IsRetrievable></Properties><Properties><PartnerKey xsi:nil="true" /><ObjectID xsi:nil="true" /><Name>SubscriberTypeDefinition</Name><DataType>SubscriberTypeDefinition</DataType><IsUpdatable>true</IsUpdatable><IsRetrievable>false</IsRetrievable></Properties><Properties><PartnerKey xsi:nil="true" /><ObjectID xsi:nil="true" /><Name>Addresses</Name><DataType>SubscriberAddress[]</DataType><IsUpdatable>true</IsUpdatable><IsRetrievable>false</IsRetrievable></Properties><Properties><PartnerKey xsi:nil="true" /><ObjectID xsi:nil="true" /><Name>PrimarySMSAddress</Name><DataType>SMSAddress</DataType><IsUpdatable>true</IsUpdatable><IsRetrievable>false</IsRetrievable></Properties><Properties><PartnerKey xsi:nil="true" /><ObjectID xsi:nil="true" /><Name>PrimarySMSPublicationStatus</Name><DataType>SubscriberAddressStatus</DataType><IsUpdatable>true</IsUpdatable><IsRetrievable>false</IsRetrievable></Properties><Properties><PartnerKey xsi:nil="true" /><ObjectID xsi:nil="true" /><Name>PrimaryEmailAddress</Name><DataType>EmailAddress</DataType><IsUpdatable>true</IsUpdatable><IsRetrievable>false</IsRetrievable></Properties><Properties><PartnerKey xsi:nil="true" /><ObjectID xsi:nil="true" /><Name>Locale</Name><DataType>Locale</DataType><IsUpdatable>true</IsUpdatable><IsRetrievable>false</IsRetrievable></Properties><Properties><PartnerKey xsi:nil="true" /><ObjectID xsi:nil="true" /><Name>Client</Name><DataType>ClientID</DataType><IsUpdatable>true</IsUpdatable><IsRetrievable>false</IsRetrievable></Properties><Properties><PartnerKey xsi:nil="true" /><ObjectID xsi:nil="true" /><Name>PartnerProperties</Name><DataType>APIProperty[]</DataType><IsUpdatable>true</IsUpdatable><IsRetrievable>false</IsRetrievable></Properties><Properties><PartnerKey xsi:nil="true" /><ObjectID xsi:nil="true" /><Name>ModifiedDate</Name><DataType>DateTime</DataType><IsUpdatable>true</IsUpdatable><IsRetrievable>false</IsRetrievable></Properties><Properties><PartnerKey xsi:nil="true" /><ObjectID xsi:nil="true" /><Name>ObjectID</Name><DataType>String</DataType><IsUpdatable>true</IsUpdatable><IsRetrievable>false</IsRetrievable></Properties><Properties><PartnerKey xsi:nil="true" /><ObjectID xsi:nil="true" /><Name>CustomerKey</Name><DataType>String</DataType><IsUpdatable>true</IsUpdatable><IsRetrievable>false</IsRetrievable></Properties><Properties><PartnerKey xsi:nil="true" /><ObjectID xsi:nil="true" /><Name>Owner</Name><DataType>Owner</DataType><IsUpdatable>true</IsUpdatable><IsRetrievable>false</IsRetrievable></Properties><Properties><PartnerKey xsi:nil="true" /><ObjectID xsi:nil="true" /><Name>CorrelationID</Name><DataType>String</DataType><IsUpdatable>true</IsUpdatable><IsRetrievable>false</IsRetrievable></Properties><Properties><PartnerKey xsi:nil="true" /><ObjectID xsi:nil="true" /><Name>ObjectState</Name><DataType>String</DataType><IsUpdatable>true</IsUpdatable><IsRetrievable>false</IsRetrievable></Properties><Properties><PartnerKey xsi:nil="true" /><ObjectID xsi:nil="true" /><Name>IsPlatformObject</Name><DataType>Boolean</DataType><IsUpdatable>true</IsUpdatable><IsRetrievable>false</IsRetrievable></Properties><ExtendedProperties><ExtendedProperty><PartnerKey xsi:nil="true" /><ID>16997</ID><ObjectID xsi:nil="true" /><Name>First Name</Name><DataType>text</DataType><PropertyType>string</PropertyType><IsAccountProperty>false</IsAccountProperty><Label>a</Label><Description /><MaxLength>50</MaxLength><IsRequired>false</IsRequired><IsViewable>true</IsViewable><IsEditable>true</IsEditable><IsRestrictedPicklist>false</IsRestrictedPicklist><IsSendTime>false</IsSendTime><DisplayOrder>2</DisplayOrder></ExtendedProperty><ExtendedProperty><PartnerKey xsi:nil="true" /><ID>16998</ID><ObjectID xsi:nil="true" /><Name>Last Name</Name><DataType>text</DataType><PropertyType>string</PropertyType><IsAccountProperty>false</IsAccountProperty><Label>a</Label><Description /><MaxLength>50</MaxLength><IsRequired>false</IsRequired><IsViewable>true</IsViewable><IsEditable>true</IsEditable><IsRestrictedPicklist>false</IsRestrictedPicklist><IsSendTime>false</IsSendTime><DisplayOrder>3</DisplayOrder></ExtendedProperty><ExtendedProperty><PartnerKey xsi:nil="true" /><ID>21875</ID><ObjectID xsi:nil="true" /><Name>SFDC_FirstName</Name><DataType>text</DataType><PropertyType>string</PropertyType><IsAccountProperty>false</IsAccountProperty><Label>a</Label><Description>For the subscribers with an SFID</Description><MaxLength>50</MaxLength><IsRequired>false</IsRequired><IsViewable>true</IsViewable><IsEditable>true</IsEditable><IsRestrictedPicklist>false</IsRestrictedPicklist><IsSendTime>false</IsSendTime><DisplayOrder>4</DisplayOrder></ExtendedProperty><ExtendedProperty><PartnerKey xsi:nil="true" /><ID>21876</ID><ObjectID xsi:nil="true" /><Name>SFDC_LastName</Name><DataType>text</DataType><PropertyType>string</PropertyType><IsAccountProperty>false</IsAccountProperty><Label>a</Label><Description>For the subscribers with an SFID</Description><MaxLength>50</MaxLength><IsRequired>false</IsRequired><IsViewable>true</IsViewable><IsEditable>true</IsEditable><IsRestrictedPicklist>false</IsRestrictedPicklist><IsSendTime>false</IsSendTime><DisplayOrder>5</DisplayOrder></ExtendedProperty></ExtendedProperties><ChildObjects><Name>Attributes</Name><Properties><PartnerKey xsi:nil="true" /><ID>16997</ID><ObjectID xsi:nil="true" /><Name>First Name</Name><DataType>text</DataType><Markups><Name>SubstitutionString</Name><Value>%%First Name%%</Value></Markups></Properties></ChildObjects><ChildObjects><Name>Attributes</Name><Properties><PartnerKey xsi:nil="true" /><ID>16998</ID><ObjectID xsi:nil="true" /><Name>Last Name</Name><DataType>text</DataType><Markups><Name>SubstitutionString</Name><Value>%%Last Name%%</Value></Markups></Properties></ChildObjects><ChildObjects><Name>Attributes</Name><Properties><PartnerKey xsi:nil="true" /><ID>21875</ID><ObjectID xsi:nil="true" /><Name>SFDC_FirstName</Name><DataType>text</DataType><Markups><Name>SubstitutionString</Name><Value>%%SFDC_FirstName%%</Value></Markups></Properties></ChildObjects><ChildObjects><Name>Attributes</Name><Properties><PartnerKey xsi:nil="true" /><ID>21876</ID><ObjectID xsi:nil="true" /><Name>SFDC_LastName</Name><DataType>text</DataType><Markups><Name>SubstitutionString</Name><Value>%%SFDC_LastName%%</Value></Markups></Properties></ChildObjects></ObjectDefinition><RequestID>af61574f-2af5-45d5-82ac-b37719afe4e9</RequestID></DefinitionResponseMsg></soap:Body></soap:Envelope>',
    parsed: {
        ObjectDefinition: {
            ObjectType: 'Subscriber',
            Properties: [
                {
                    PartnerKey: '',
                    ObjectID: '',
                    Name: 'ID',
                    DataType: 'Int32',
                    IsUpdatable: true,
                    IsRetrievable: true,
                    IsRequired: true,
                },
                {
                    PartnerKey: '',
                    ObjectID: '',
                    Name: 'PartnerKey',
                    DataType: 'String',
                    IsUpdatable: true,
                    IsRetrievable: true,
                    MaxLength: 64,
                    IsRequired: false,
                },
                {
                    PartnerKey: '',
                    ObjectID: '',
                    Name: 'CreatedDate',
                    DataType: 'DateTime',
                    IsUpdatable: true,
                    IsRetrievable: true,
                    IsRequired: false,
                },
                {
                    PartnerKey: '',
                    ObjectID: '',
                    Name: 'Client.ID',
                    DataType: 'Int32',
                    IsUpdatable: true,
                    IsRetrievable: true,
                    IsRequired: true,
                },
                {
                    PartnerKey: '',
                    ObjectID: '',
                    Name: 'Client.PartnerClientKey',
                    DataType: 'String',
                    IsUpdatable: true,
                    IsRetrievable: true,
                    MaxLength: 64,
                    IsRequired: false,
                },
                {
                    PartnerKey: '',
                    ObjectID: '',
                    Name: 'EmailAddress',
                    DataType: 'String',
                    IsUpdatable: true,
                    IsRetrievable: true,
                    MaxLength: 254,
                    IsRequired: true,
                },
                {
                    PartnerKey: '',
                    ObjectID: '',
                    Name: 'SubscriberKey',
                    DataType: 'String',
                    IsUpdatable: true,
                    IsRetrievable: true,
                    MaxLength: 254,
                    IsRequired: true,
                },
                {
                    PartnerKey: '',
                    ObjectID: '',
                    Name: 'UnsubscribedDate',
                    DataType: 'DateTime',
                    IsUpdatable: true,
                    IsRetrievable: true,
                    IsRequired: false,
                },
                {
                    PartnerKey: '',
                    ObjectID: '',
                    Name: 'Status',
                    DataType: 'SubscriberStatus',
                    IsUpdatable: true,
                    IsRetrievable: true,
                    IsRequired: true,
                },
                {
                    PartnerKey: '',
                    ObjectID: '',
                    Name: 'EmailTypePreference',
                    DataType: 'EmailType',
                    IsUpdatable: true,
                    IsRetrievable: true,
                    IsRequired: true,
                },
                {
                    PartnerKey: '',
                    ObjectID: '',
                    Name: 'Attributes',
                    DataType: 'Attribute[]',
                    IsUpdatable: true,
                    IsRetrievable: false,
                },
                {
                    PartnerKey: '',
                    ObjectID: '',
                    Name: 'PartnerType',
                    DataType: 'String',
                    IsUpdatable: true,
                    IsRetrievable: false,
                },
                {
                    PartnerKey: '',
                    ObjectID: '',
                    Name: 'Lists',
                    DataType: 'SubscriberList[]',
                    IsUpdatable: true,
                    IsRetrievable: false,
                },
                {
                    PartnerKey: '',
                    ObjectID: '',
                    Name: 'GlobalUnsubscribeCategory',
                    DataType: 'GlobalUnsubscribeCategory',
                    IsUpdatable: true,
                    IsRetrievable: false,
                },
                {
                    PartnerKey: '',
                    ObjectID: '',
                    Name: 'SubscriberTypeDefinition',
                    DataType: 'SubscriberTypeDefinition',
                    IsUpdatable: true,
                    IsRetrievable: false,
                },
                {
                    PartnerKey: '',
                    ObjectID: '',
                    Name: 'Addresses',
                    DataType: 'SubscriberAddress[]',
                    IsUpdatable: true,
                    IsRetrievable: false,
                },
                {
                    PartnerKey: '',
                    ObjectID: '',
                    Name: 'PrimarySMSAddress',
                    DataType: 'SMSAddress',
                    IsUpdatable: true,
                    IsRetrievable: false,
                },
                {
                    PartnerKey: '',
                    ObjectID: '',
                    Name: 'PrimarySMSPublicationStatus',
                    DataType: 'SubscriberAddressStatus',
                    IsUpdatable: true,
                    IsRetrievable: false,
                },
                {
                    PartnerKey: '',
                    ObjectID: '',
                    Name: 'PrimaryEmailAddress',
                    DataType: 'EmailAddress',
                    IsUpdatable: true,
                    IsRetrievable: false,
                },
                {
                    PartnerKey: '',
                    ObjectID: '',
                    Name: 'Locale',
                    DataType: 'Locale',
                    IsUpdatable: true,
                    IsRetrievable: false,
                },
                {
                    PartnerKey: '',
                    ObjectID: '',
                    Name: 'Client',
                    DataType: 'ClientID',
                    IsUpdatable: true,
                    IsRetrievable: false,
                },
                {
                    PartnerKey: '',
                    ObjectID: '',
                    Name: 'PartnerProperties',
                    DataType: 'APIProperty[]',
                    IsUpdatable: true,
                    IsRetrievable: false,
                },
                {
                    PartnerKey: '',
                    ObjectID: '',
                    Name: 'ModifiedDate',
                    DataType: 'DateTime',
                    IsUpdatable: true,
                    IsRetrievable: false,
                },
                {
                    PartnerKey: '',
                    ObjectID: '',
                    Name: 'ObjectID',
                    DataType: 'String',
                    IsUpdatable: true,
                    IsRetrievable: false,
                },
                {
                    PartnerKey: '',
                    ObjectID: '',
                    Name: 'CustomerKey',
                    DataType: 'String',
                    IsUpdatable: true,
                    IsRetrievable: false,
                },
                {
                    PartnerKey: '',
                    ObjectID: '',
                    Name: 'Owner',
                    DataType: 'Owner',
                    IsUpdatable: true,
                    IsRetrievable: false,
                },
                {
                    PartnerKey: '',
                    ObjectID: '',
                    Name: 'CorrelationID',
                    DataType: 'String',
                    IsUpdatable: true,
                    IsRetrievable: false,
                },
                {
                    PartnerKey: '',
                    ObjectID: '',
                    Name: 'ObjectState',
                    DataType: 'String',
                    IsUpdatable: true,
                    IsRetrievable: false,
                },
                {
                    PartnerKey: '',
                    ObjectID: '',
                    Name: 'IsPlatformObject',
                    DataType: 'Boolean',
                    IsUpdatable: true,
                    IsRetrievable: false,
                },
            ],
            ExtendedProperties: {
                ExtendedProperty: [
                    {
                        PartnerKey: '',
                        ID: 16997,
                        ObjectID: '',
                        Name: 'First Name',
                        DataType: 'text',
                        PropertyType: 'string',
                        IsAccountProperty: false,
                        Label: 'a',
                        Description: '',
                        MaxLength: 50,
                        IsRequired: false,
                        IsViewable: true,
                        IsEditable: true,
                        IsRestrictedPicklist: false,
                        IsSendTime: false,
                        DisplayOrder: 2,
                    },
                    {
                        PartnerKey: '',
                        ID: 16998,
                        ObjectID: '',
                        Name: 'Last Name',
                        DataType: 'text',
                        PropertyType: 'string',
                        IsAccountProperty: false,
                        Label: 'a',
                        Description: '',
                        MaxLength: 50,
                        IsRequired: false,
                        IsViewable: true,
                        IsEditable: true,
                        IsRestrictedPicklist: false,
                        IsSendTime: false,
                        DisplayOrder: 3,
                    },
                    {
                        PartnerKey: '',
                        ID: 21875,
                        ObjectID: '',
                        Name: 'SFDC_FirstName',
                        DataType: 'text',
                        PropertyType: 'string',
                        IsAccountProperty: false,
                        Label: 'a',
                        Description: 'For the subscribers with an SFID',
                        MaxLength: 50,
                        IsRequired: false,
                        IsViewable: true,
                        IsEditable: true,
                        IsRestrictedPicklist: false,
                        IsSendTime: false,
                        DisplayOrder: 4,
                    },
                    {
                        PartnerKey: '',
                        ID: 21876,
                        ObjectID: '',
                        Name: 'SFDC_LastName',
                        DataType: 'text',
                        PropertyType: 'string',
                        IsAccountProperty: false,
                        Label: 'a',
                        Description: 'For the subscribers with an SFID',
                        MaxLength: 50,
                        IsRequired: false,
                        IsViewable: true,
                        IsEditable: true,
                        IsRestrictedPicklist: false,
                        IsSendTime: false,
                        DisplayOrder: 5,
                    },
                ],
            },
            ChildObjects: [
                {
                    Name: 'Attributes',
                    Properties: {
                        PartnerKey: '',
                        ID: 16997,
                        ObjectID: '',
                        Name: 'First Name',
                        DataType: 'text',
                        Markups: {
                            Name: 'SubstitutionString',
                            Value: '%%First Name%%',
                        },
                    },
                },
                {
                    Name: 'Attributes',
                    Properties: {
                        PartnerKey: '',
                        ID: 16998,
                        ObjectID: '',
                        Name: 'Last Name',
                        DataType: 'text',
                        Markups: {
                            Name: 'SubstitutionString',
                            Value: '%%Last Name%%',
                        },
                    },
                },
                {
                    Name: 'Attributes',
                    Properties: {
                        PartnerKey: '',
                        ID: 21875,
                        ObjectID: '',
                        Name: 'SFDC_FirstName',
                        DataType: 'text',
                        Markups: {
                            Name: 'SubstitutionString',
                            Value: '%%SFDC_FirstName%%',
                        },
                    },
                },
                {
                    Name: 'Attributes',
                    Properties: {
                        PartnerKey: '',
                        ID: 21876,
                        ObjectID: '',
                        Name: 'SFDC_LastName',
                        DataType: 'text',
                        Markups: {
                            Name: 'SubstitutionString',
                            Value: '%%SFDC_LastName%%',
                        },
                    },
                },
            ],
        },
        RequestID: 'af61574f-2af5-45d5-82ac-b37719afe4e9',
    },
};
export const subscribeUnsub = {
    status: 200,
    action: 'Execute',
    response:
        '<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:wsa="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd"><soap:Header><wsa:Action>ExecuteResponse</wsa:Action><wsa:MessageID>urn:uuid:f47d09ca-87ba-4be3-a34d-cc3e6a6e6375</wsa:MessageID><wsa:RelatesTo>urn:uuid:3a7af027-c85c-4fad-8e3a-aea32f32a08f</wsa:RelatesTo><wsa:To>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</wsa:To><wsse:Security><wsu:Timestamp wsu:Id="Timestamp-0fce5583-12f7-443c-b6fc-5fdafe9fa2af"><wsu:Created>2021-12-30T20:27:43Z</wsu:Created><wsu:Expires>2021-12-30T20:32:43Z</wsu:Expires></wsu:Timestamp></wsse:Security></soap:Header><soap:Body><ExecuteResponseMsg xmlns="http://exacttarget.com/wsdl/partnerAPI"><OverallStatus>OK</OverallStatus><RequestID>dd9bb381-636a-49f5-be3f-1c5901c36656</RequestID><Results><StatusCode>OK</StatusCode><StatusMessage>Event posted</StatusMessage></Results></ExecuteResponseMsg></soap:Body></soap:Envelope>',
    parsed: {
        OverallStatus: 'OK',
        RequestID: 'dd9bb381-636a-49f5-be3f-1c5901c36656',
        Results: [{ StatusCode: 'OK', StatusMessage: 'Event posted' }],
    },
};
export const badRequest = {
    status: 400,
    action: 'Create',
    response: 'Bad Request',
};
export const queryPerform = {
    status: 200,
    action: 'Perform',
    response:
        '<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:wsa="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd"><soap:Header><wsa:Action>PerformResponse</wsa:Action><wsa:MessageID>urn:uuid:9d3568e8-437b-4aa0-b011-445c4baff1a2</wsa:MessageID><wsa:RelatesTo>urn:uuid:99c4eda4-8df0-4516-8413-c942608f5984</wsa:RelatesTo><wsa:To>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</wsa:To><wsse:Security><wsu:Timestamp wsu:Id="Timestamp-5ba6b289-bd18-4392-a023-87ffb6fd102b"><wsu:Created>2021-12-30T21:26:18Z</wsu:Created><wsu:Expires>2021-12-30T21:31:18Z</wsu:Expires></wsu:Timestamp></wsse:Security></soap:Header><soap:Body><PerformResponseMsg xmlns="http://exacttarget.com/wsdl/partnerAPI"><Results><Result><StatusCode>OK</StatusCode><StatusMessage>QueryDefinition perform called successfully</StatusMessage><Object xsi:type="QueryDefinition"><PartnerKey xsi:nil="true" /><ObjectID>a077064d-bcc9-4a8f-8bef-4df950193824</ObjectID></Object><Task><StatusCode>OK</StatusCode><StatusMessage>OK</StatusMessage><ID>127061082</ID><InteractionObjectID>fcbb5c2e-6b2b-4fc6-9be0-45f8dfe4f553</InteractionObjectID></Task></Result></Results><OverallStatus>OK</OverallStatus><OverallStatusMessage /><RequestID>10d3e7eb-0a84-4a88-9ee3-20618b93a2f1</RequestID></PerformResponseMsg></soap:Body></soap:Envelope>',
    parsed: {
        Results: [
            {
                Result: {
                    StatusCode: 'OK',
                    StatusMessage: 'QueryDefinition perform called successfully',
                    Object: {
                        PartnerKey: '',
                        ObjectID: 'a077064d-bcc9-4a8f-8bef-4df950193824',
                    },
                    Task: {
                        StatusCode: 'OK',
                        StatusMessage: 'OK',
                        ID: 127061082,
                        InteractionObjectID: 'fcbb5c2e-6b2b-4fc6-9be0-45f8dfe4f553',
                    },
                },
            },
        ],
        OverallStatus: 'OK',
        OverallStatusMessage: '',
        RequestID: '10d3e7eb-0a84-4a88-9ee3-20618b93a2f1',
    },
};
export const accountUserConfigure = {
    status: 200,
    action: 'Configure',
    response:
        '<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:wsa="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd"><soap:Header><wsa:Action>ConfigureResponse</wsa:Action><wsa:MessageID>urn:uuid:bdcd5661-30f5-4c2e-902e-37f7eeff5e37</wsa:MessageID><wsa:RelatesTo>urn:uuid:7c56718c-3769-43e8-a223-46e7e94ae09f</wsa:RelatesTo><wsa:To>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</wsa:To><wsse:Security><wsu:Timestamp wsu:Id="Timestamp-e10f6cdf-a132-4fe1-a50a-1930558bd26f"><wsu:Created>2023-02-24T12:11:01Z</wsu:Created><wsu:Expires>2023-02-24T12:16:01Z</wsu:Expires></wsu:Timestamp></wsse:Security></soap:Header><soap:Body><ConfigureResponseMsg xmlns="http://exacttarget.com/wsdl/partnerAPI"><Results><Result><StatusCode>OK</StatusCode><StatusMessage>User Business Unit assignments successfully updated</StatusMessage><OrdinalID>0</OrdinalID><Object xsi:type="AccountUser"><Client><ID>7281698</ID></Client><PartnerKey xsi:nil="true" /><ID>717133502</ID><ObjectID xsi:nil="true" /><Delete>0</Delete><BusinessUnitAssignmentConfiguration><BusinessUnitIds><BusinessUnitId>7330566</BusinessUnitId></BusinessUnitIds><IsDelete>false</IsDelete></BusinessUnitAssignmentConfiguration></Object></Result><Result><StatusCode>OK</StatusCode><StatusMessage>User Business Unit assignments successfully updated</StatusMessage><OrdinalID>1</OrdinalID><Object xsi:type="AccountUser"><Client><ID>7281698</ID></Client><PartnerKey xsi:nil="true" /><ID>717133502</ID><ObjectID xsi:nil="true" /><Delete>0</Delete><BusinessUnitAssignmentConfiguration><BusinessUnitIds><BusinessUnitId>518003624</BusinessUnitId><BusinessUnitId>7330565</BusinessUnitId><BusinessUnitId>518001150</BusinessUnitId></BusinessUnitIds><IsDelete>true</IsDelete></BusinessUnitAssignmentConfiguration></Object></Result></Results><OverallStatus>OK</OverallStatus><OverallStatusMessage /><RequestID>5953341f-d14c-4ffd-89ec-fdefd904c690</RequestID></ConfigureResponseMsg></soap:Body></soap:Envelope>',
    parsed: {
        Results: [
            {
                Result: [
                    {
                        StatusCode: 'OK',
                        StatusMessage: 'User Business Unit assignments successfully updated',
                        OrdinalID: 0,
                        Object: {
                            Client: { ID: 7281698 },
                            PartnerKey: '',
                            ID: 717133502,
                            ObjectID: '',
                            Delete: 0,
                            BusinessUnitAssignmentConfiguration: {
                                BusinessUnitIds: { BusinessUnitId: 7330566 },
                                IsDelete: false,
                            },
                        },
                    },
                    {
                        StatusCode: 'OK',
                        StatusMessage: 'User Business Unit assignments successfully updated',
                        OrdinalID: 1,
                        Object: {
                            Client: { ID: 7281698 },
                            PartnerKey: '',
                            ID: 717133502,
                            ObjectID: '',
                            Delete: 0,
                            BusinessUnitAssignmentConfiguration: {
                                BusinessUnitIds: {
                                    BusinessUnitId: [518003624, 7330565, 518001150],
                                },
                                IsDelete: true,
                            },
                        },
                    },
                ],
            },
        ],
        OverallStatus: 'OK',
        OverallStatusMessage: '',
        RequestID: '5953341f-d14c-4ffd-89ec-fdefd904c690',
    },
};
export const automationSchedule = {
    status: 200,
    action: 'Schedule',
    response:
        '<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:wsa="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd"><soap:Header><wsa:Action>ScheduleResponse</wsa:Action><wsa:MessageID>urn:uuid:26a39780-1ee8-45e2-a62a-78bb2fce8356</wsa:MessageID><wsa:RelatesTo>urn:uuid:6123508a-a2d3-4f7e-9040-b0d22906ed90</wsa:RelatesTo><wsa:To>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</wsa:To><wsse:Security><wsu:Timestamp wsu:Id="Timestamp-4f874687-b4a6-4c26-9178-f5e05828ea00"><wsu:Created>2021-12-30T21:53:54Z</wsu:Created><wsu:Expires>2021-12-30T21:58:54Z</wsu:Expires></wsu:Timestamp></wsse:Security></soap:Header><soap:Body><ScheduleResponseMsg xmlns="http://exacttarget.com/wsdl/partnerAPI"><Results><Result><StatusCode>OK</StatusCode><StatusMessage>Program scheduled.</StatusMessage><Object><PartnerKey xsi:nil="true" /><ObjectID xsi:nil="true" /><RecurrenceType>Hourly</RecurrenceType><RecurrenceRangeType>EndAfter</RecurrenceRangeType><StartDateTime>2019-11-07T11:26:19.142-06:00</StartDateTime><Occurrences>5</Occurrences></Object><Task /></Result></Results><OverallStatus>OK</OverallStatus><OverallStatusMessage /><RequestID>301a87eb-ffa0-4890-8f02-205301e04a69</RequestID></ScheduleResponseMsg></soap:Body></soap:Envelope>',
    parsed: {
        Results: [
            {
                Result: {
                    StatusCode: 'OK',
                    StatusMessage: 'Program scheduled.',
                    Object: {
                        PartnerKey: '',
                        ObjectID: '',
                        RecurrenceType: 'Hourly',
                        RecurrenceRangeType: 'EndAfter',
                        StartDateTime: '2019-11-07T11:26:19.142-06:00',
                        Occurrences: 5,
                    },
                    Task: '',
                },
            },
        ],
        OverallStatus: 'OK',
        OverallStatusMessage: '',
        RequestID: '301a87eb-ffa0-4890-8f02-205301e04a69',
    },
};
