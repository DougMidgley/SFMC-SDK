import { assert } from 'chai';
import { defaultSdk, mock } from './utils.js';
import * as resources from './resources/soap.js';
import { success } from './resources/auth.js';
import { XMLValidator } from 'fast-xml-parser';
import { isConnectionError } from '../lib/util.js';

const addHandler = (metadata) => {
    mock.onPost(
        '/Service.asmx',
        {
            asymmetricMatch: XMLValidator.validate,
        },
        {
            headers: {
                /**
                 * matcher based on headers
                 *
                 * @param {object} headers which should be passed for matching
                 * @returns {boolean} if value matches
                 */
                asymmetricMatch(headers) {
                    return (
                        headers['SOAPAction'] === metadata.action &&
                        headers['Content-Type'] === 'text/xml'
                    );
                },
            },
        }
    ).reply(metadata.status, metadata.response, {
        'Content-Type': 'application/soap+xml; charset=utf-8',
    });
};

describe('soap', function () {
    it('preserves SOAP protocol namespace URI values', async function () {
        addHandler(resources.retrieveDataExtension);
        await defaultSdk().soap.retrieve('DataExtension', ['CustomerKey']);
        const requestBody = mock.history.post.at(-1).data;
        assert.include(requestBody, 'xmlns="http://schemas.xmlsoap.org/soap/envelope/"');
        assert.include(requestBody, 'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"');
        assert.include(requestBody, '<fueloauth xmlns="http://exacttarget.com">');
        assert.notInclude(requestBody, '<fueloauth xmlns="https://exacttarget.com">');
        assert.include(requestBody, 'RetrieveRequestMsg xmlns="http://exacttarget.com/wsdl/partnerAPI"');
    });

    beforeEach(function () {
        mock.onPost(success.url).reply(success.status, success.response);
    });

    afterEach(function () {
        mock.reset();
    });

    it('retrieve: should return 1 data extension', async function () {
        //given
        addHandler(resources.retrieveDataExtension);
        // when
        const payload = await defaultSdk().soap.retrieve('DataExtension', ['CustomerKey'], {
            filter: {
                leftOperand: {
                    leftOperand: 'CustomerKey',
                    operator: 'equals',
                    rightOperand: 'DC91A414-6240-48BC-BB89-7F3910D41580',
                },
                operator: 'AND',
                rightOperand: {
                    leftOperand: 'CustomerKey',
                    operator: 'notEquals',
                    rightOperand: '123',
                },
            },
            QueryAllAccounts: true,
        });
        // then
        assert.lengthOf(payload.Results, 1);
        assert.deepEqual(payload, resources.retrieveDataExtension.parsed);
        assert.lengthOf(mock.history.post, 2);
        return;
    });

    it('retrieveBulk: should return 2 data extensions', async function () {
        //given
        mock.onPost(
            '/Service.asmx',
            {
                asymmetricMatch: XMLValidator.validate,
            },
            {
                headers: {
                    /**
                     * matcher based on headers
                     *
                     * @param {object} headers which should be passed for matching
                     * @returns {boolean} if value matches
                     */
                    asymmetricMatch(headers) {
                        return (
                            headers['SOAPAction'] === resources.retrieveBulkDataExtension.action &&
                            headers['Content-Type'] === 'text/xml'
                        );
                    },
                },
            }
        )
            .replyOnce(
                resources.retrieveBulkDataExtension.status,
                resources.retrieveBulkDataExtension.response,
                {
                    'Content-Type': 'application/soap+xml; charset=utf-8',
                }
            )
            .onPost(
                '/Service.asmx',
                {
                    asymmetricMatch: XMLValidator.validate,
                },
                {
                    headers: {
                        /**
                         * matcher based on headers
                         *
                         * @param {object} headers which should be passed for matching
                         * @returns {boolean} if value matches
                         */
                        asymmetricMatch(headers) {
                            return (
                                headers['SOAPAction'] === resources.retrieveDataExtension.action &&
                                headers['Content-Type'] === 'text/xml'
                            );
                        },
                    },
                }
            )
            .replyOnce(
                resources.retrieveDataExtension.status,
                resources.retrieveDataExtension.response,
                {
                    'Content-Type': 'application/soap+xml; charset=utf-8',
                }
            );
        // when
        const payload = await defaultSdk().soap.retrieveBulk('DataExtension', ['CustomerKey'], {
            filter: {
                leftOperand: 'CustomerKey',
                operator: 'equals',
                rightOperand: 'DC91A414-6240-48BC-BB89-7F3910D41580',
            },
            QueryAllAccounts: true,
        });
        // then
        assert.lengthOf(payload.Results, 2);
        assert.lengthOf(mock.history.post, 3);
        return;
    });

    it('failed: should fail to create 1 subscriber', async function () {
        //given
        addHandler(resources.subscriberFailed);
        // when
        try {
            await defaultSdk().soap.create(
                'Subscriber',
                {
                    SubscriberKey: '12345123',
                    EmailAddress: 'example@example.com',
                },
                {
                    options: {
                        SaveOptions: { SaveAction: 'UpdateAdd' },
                    },
                }
            );
            // then
            assert.fail();
        } catch (error) {
            assert.deepEqual(error.json, resources.subscriberFailed.parsed);
            assert.lengthOf(mock.history.post, 2);
        }

        return;
    });

    it('create: should create 1 subscriber', async function () {
        //given
        addHandler(resources.subscriberCreated);
        // when

        const response = await defaultSdk().soap.create(
            'Subscriber',
            {
                SubscriberKey: '1234512345',
                EmailAddress: 'douglas@accenture.com',
            },
            {
                options: {
                    SaveOptions: { SaveAction: 'UpdateAdd' },
                },
            }
        );
        // then
        assert.deepEqual(response, resources.subscriberCreated.parsed);
        assert.lengthOf(mock.history.post, 2);

        return;
    });

    it('update: should update 1 subscriber', async function () {
        //given
        addHandler(resources.subscriberUpdated);
        // when

        const response = await defaultSdk().soap.update(
            'Subscriber',
            {
                SubscriberKey: '1234512345',
                EmailAddress: 'douglas@accenture.com',
            },
            {
                options: {
                    SaveOptions: { SaveAction: 'UpdateAdd' },
                },
            }
        );
        // then
        assert.deepEqual(response, resources.subscriberUpdated.parsed);
        assert.lengthOf(mock.history.post, 2);

        return;
    });

    it('expired: should return an error of expired token', async function () {
        //given
        addHandler(resources.expiredToken);
        // when
        try {
            await defaultSdk().soap.create('Subscriber', {
                SubscriberKey: '1234512345',
                EmailAddress: 'douglas@accenture.com',
            });
        } catch (error) {
            // then
            assert.equal(error.message, 'Token Expired');
            assert.lengthOf(mock.history.post, 4);

            return;
        }
        assert.fail();
    });

    it('coalesces overlapping and delayed stale SOAP token faults', async function () {
        mock.reset();
        const refreshed = { ...success.response, access_token: 'NEW_TOKEN' };
        const { promise: refreshCompleted, resolve: releaseStaleResponse } =
            Promise.withResolvers();
        mock.onPost(success.url)
            .replyOnce(success.status, success.response)
            .onPost(success.url)
            .replyOnce(() => {
                releaseStaleResponse();
                return [success.status, refreshed];
            });
        let oldTokenRequests = 0;
        mock.onPost('/Service.asmx').reply(async (config) => {
            if (config.data.includes('NEW_TOKEN')) {
                return [
                    resources.subscriberCreated.status,
                    resources.subscriberCreated.response,
                    { 'Content-Type': 'application/soap+xml; charset=utf-8' },
                ];
            }
            oldTokenRequests++;
            if (oldTokenRequests === 2) {
                await refreshCompleted;
            }
            return [
                resources.expiredToken.status,
                resources.expiredToken.response,
                { 'Content-Type': 'application/soap+xml; charset=utf-8' },
            ];
        });
        const sdk = defaultSdk();
        const subscriber = {
            SubscriberKey: '1234512345',
            EmailAddress: 'douglas@accenture.com',
        };

        const responses = await Promise.all([
            sdk.soap.create('Subscriber', { ...subscriber }),
            sdk.soap.create('Subscriber', { ...subscriber }),
        ]);

        assert.isTrue(responses.every((response) => response.OverallStatus === 'OK'));
        assert.lengthOf(mock.history.post, 6);
        const authState = await sdk.auth.getAccessTokenState();
        assert.equal(authState.generation, 2);
    });

    it('coalesces a mixed REST and SOAP expiry race', async function () {
        mock.reset();
        const refreshed = { ...success.response, access_token: 'NEW_TOKEN' };
        const { promise: refreshCompleted, resolve: releaseStaleResponse } =
            Promise.withResolvers();
        mock.onPost(success.url)
            .replyOnce(success.status, success.response)
            .onPost(success.url)
            .replyOnce(() => {
                releaseStaleResponse();
                return [success.status, refreshed];
            });
        const { journeysPage1 } = await import('./resources/rest.js');
        mock.onGet(journeysPage1.url).reply((config) => {
            return config.headers.Authorization === 'Bearer NEW_TOKEN'
                ? [journeysPage1.status, journeysPage1.response]
                : [401, { message: 'expired' }];
        });
        mock.onPost('/Service.asmx').reply(async (config) => {
            if (config.data.includes('NEW_TOKEN')) {
                return [
                    resources.subscriberCreated.status,
                    resources.subscriberCreated.response,
                    { 'Content-Type': 'application/soap+xml; charset=utf-8' },
                ];
            }
            await refreshCompleted;
            return [
                resources.expiredToken.status,
                resources.expiredToken.response,
                { 'Content-Type': 'application/soap+xml; charset=utf-8' },
            ];
        });
        const sdk = defaultSdk();

        const [restResponse, soapResponse] = await Promise.all([
            sdk.rest.get('interaction/v1/interactions?$pageSize=5&$page=1'),
            sdk.soap.create('Subscriber', {
                SubscriberKey: '1234512345',
                EmailAddress: 'douglas@accenture.com',
            }),
        ]);

        assert.lengthOf(restResponse.items, 5);
        assert.equal(soapResponse.OverallStatus, 'OK');
        assert.lengthOf(mock.history.post, 4);
        const authState = await sdk.auth.getAccessTokenState();
        assert.equal(authState.generation, 2);
    });

    it('no handler: should return an error stating the object type is not supported', async function () {
        //given
        addHandler(resources.noObjectHandlerFound);
        // when
        try {
            await defaultSdk().soap.retrieve('DeliveryProfile', ['CustomerKey']);
        } catch (error) {
            // then
            assert.equal(
                error.message,
                'Unable to find a handler for object type: DeliveryProfile. Object types are case-sensitive, check spelling.'
            );
            assert.lengthOf(mock.history.post, 2);

            return;
        }
        assert.fail();
    });

    it('bad Request: should return an error of bad request', async function () {
        //given
        addHandler(resources.badRequest);
        // when
        try {
            await defaultSdk().soap.create('Subscriber', {
                SubscriberKey: [[['value']]],
            });
        } catch (error) {
            // then
            assert.equal(error.response.data, 'Bad Request');
            assert.lengthOf(mock.history.post, 2);
            return;
        }
        assert.fail();
    });

    it('Delete: should delete a subscriber', async function () {
        //given
        addHandler(resources.subscriberDeleted);
        // when
        const response = await defaultSdk().soap.delete('Subscriber', {
            SubscriberKey: '1234512345',
        });
        // then
        assert.deepEqual(resources.subscriberDeleted.parsed, response);
        assert.lengthOf(mock.history.post, 2);
        return;
    });

    it('Describe: should describe the subscriber type', async function () {
        //given
        addHandler(resources.subscriberDescribed);
        // when
        const response = await defaultSdk().soap.describe('Subscriber');
        // then
        assert.deepEqual(resources.subscriberDescribed.parsed, response);
        assert.lengthOf(mock.history.post, 2);
        return;
    });

    it('Execute: should unsubscribe subscriber', async function () {
        //given
        addHandler(resources.subscribeUnsub);
        // when
        const response = await defaultSdk().soap.execute('LogUnsubEvent', {
            Name: 'SubscriberKey',
            Value: '12345',
        });
        // then
        assert.deepEqual(resources.subscribeUnsub.parsed, response);
        assert.lengthOf(mock.history.post, 2);
        return;
    });

    it('Perform: should unsubscribe subscriber', async function () {
        //given
        addHandler(resources.queryPerform);
        // when
        const response = await defaultSdk().soap.perform('QueryDefinition', 'Start', {
            ObjectID: 'a077064d-bcc9-4a8f-8bef-4df950193824',
        });
        // then
        assert.deepEqual(resources.queryPerform.parsed, response);
        assert.lengthOf(mock.history.post, 2);
        return;
    });

    it('Configure: should assign a business unit to a user', async function () {
        //given
        addHandler(resources.accountUserConfigure);
        // when
        const response = await defaultSdk().soap.configure('AccountUser', [
            {
                Client: { ID: 7281698 },
                ID: '717133502',
                BusinessUnitAssignmentConfiguration: {
                    BusinessUnitIds: { BusinessUnitId: [7330566] },
                    IsDelete: false,
                },
            },
            {
                Client: { ID: 7281698 },
                ID: '717133502',
                BusinessUnitAssignmentConfiguration: {
                    BusinessUnitIds: { BusinessUnitId: [518003624, 7330565, 518001150] },
                    IsDelete: true,
                },
            },
        ]);
        // then
        assert.deepEqual(resources.accountUserConfigure.parsed, response);
        assert.lengthOf(mock.history.post, 2);
        return;
    });

    it('Schedule: should schedule an Automation', async function () {
        //given
        addHandler(resources.automationSchedule);
        // when
        const response = await defaultSdk().soap.schedule(
            'Automation',
            {
                RecurrenceType: 'Hourly',
                RecurrenceRangeType: 'EndAfter',
                RecurrenceTypeSpecified: true,
                StartDateTime: '2019-11-07T17:26:19.142Z',
                Occurrences: 5,
            },
            {
                Interaction: {
                    ObjectID: '94d015c2-54e6-4bcf-8afe-74067b61974b',
                },
            },
            'Start'
        );
        // then
        assert.deepEqual(resources.automationSchedule.parsed, response);
        assert.lengthOf(mock.history.post, 2);
        return;
    });

    it('RETRY: should return 1 data extension, after a connection error', async function () {
        //given

        mock.onPost('/Service.asmx')
            .timeoutOnce()
            .onPost(
                '/Service.asmx',
                {
                    asymmetricMatch: XMLValidator.validate,
                },
                {
                    headers: {
                        /**
                         * matcher based on headers
                         *
                         * @param {object} headers which should be passed for matching
                         * @returns {boolean} if value matches
                         */
                        asymmetricMatch(headers) {
                            return (
                                headers['SOAPAction'] === resources.retrieveDataExtension.action &&
                                headers['Content-Type'] === 'text/xml'
                            );
                        },
                    },
                }
            )
            .reply(
                resources.retrieveDataExtension.status,
                resources.retrieveDataExtension.response,
                {
                    'Content-Type': 'application/soap+xml; charset=utf-8',
                }
            );
        // when
        const payload = await defaultSdk().soap.retrieve('DataExtension', ['CustomerKey'], {
            filter: {
                leftOperand: {
                    leftOperand: 'CustomerKey',
                    operator: 'equals',
                    rightOperand: 'DC91A414-6240-48BC-BB89-7F3910D41580',
                },
                operator: 'AND',
                rightOperand: {
                    leftOperand: 'CustomerKey',
                    operator: 'notEquals',
                    rightOperand: '123',
                },
            },
            QueryAllAccounts: true,
        });
        // then
        assert.lengthOf(payload.Results, 1);
        assert.deepEqual(payload, resources.retrieveDataExtension.parsed);
        assert.lengthOf(mock.history.post, 3);
        return;
    });

    it('FAILED RETRY: should return error, after multiple connection error', async function () {
        //given

        mock.onPost('/Service.asmx').timeout();
        // when
        try {
            await defaultSdk().soap.retrieve('DataExtension', ['CustomerKey'], {
                filter: {
                    leftOperand: {
                        leftOperand: 'CustomerKey',
                        operator: 'equals',
                        rightOperand: 'DC91A414-6240-48BC-BB89-7F3910D41580',
                    },
                    operator: 'AND',
                    rightOperand: {
                        leftOperand: 'CustomerKey',
                        operator: 'notEquals',
                        rightOperand: '123',
                    },
                },
                QueryAllAccounts: true,
            });
            assert.fail();
        } catch (error) {
            // then
            assert.isTrue(isConnectionError(error.code));
        }
        assert.lengthOf(mock.history.post, 3);
        return;
    });
});
