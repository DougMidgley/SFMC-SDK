const assert = require('chai').assert;
const { defaultSdk, mock } = require('./utils.js');
const resources = require('./resources/soap.json');
const authResources = require('./resources/auth.json');
const { XMLValidator } = require('fast-xml-parser');
const { isConnectionError } = require('../lib/util');

const addHandler = (metadata) => {
    mock.onPost(
        '/Service.asmx',
        {
            asymmetricMatch: XMLValidator.validate,
        },
        {
            asymmetricMatch(headers) {
                return (
                    headers['SOAPAction'] === metadata.action &&
                    headers['Content-Type'] === 'text/xml'
                );
            },
        }
    ).reply(metadata.status, metadata.response, {
        'Content-Type': 'application/soap+xml; charset=utf-8',
    });
};

describe('soap', function () {
    beforeEach(function () {
        mock.onPost(authResources.success.url).reply(
            authResources.success.status,
            authResources.success.response
        );
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
                asymmetricMatch(headers) {
                    return (
                        headers['SOAPAction'] === resources.retrieveBulkDataExtension.action &&
                        headers['Content-Type'] === 'text/xml'
                    );
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
                    asymmetricMatch(headers) {
                        return (
                            headers['SOAPAction'] === resources.retrieveDataExtension.action &&
                            headers['Content-Type'] === 'text/xml'
                        );
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
                    asymmetricMatch(headers) {
                        return (
                            headers['SOAPAction'] === resources.retrieveDataExtension.action &&
                            headers['Content-Type'] === 'text/xml'
                        );
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
