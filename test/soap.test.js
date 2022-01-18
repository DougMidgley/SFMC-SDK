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
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'text/xml',
            SOAPAction: metadata.action,
        }
    ).reply(metadata.status, metadata.response);
};

describe('soap', () => {
    beforeEach(() => {
        mock.onPost(authResources.success.url).reply(
            authResources.success.status,
            authResources.success.response
        );
    });
    afterEach(() => {
        mock.reset();
    });

    it('retrieve: should return 1 data extension', async () => {
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
    it('retrieveBulk: should return 2 data extensions', async () => {
        //given
        mock.onPost(
            '/Service.asmx',
            {
                asymmetricMatch: XMLValidator.validate,
            },
            {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'text/xml',
                SOAPAction: resources.retrieveBulkDataExtension.action,
            }
        )
            .replyOnce(
                resources.retrieveBulkDataExtension.status,
                resources.retrieveBulkDataExtension.response
            )
            .onPost(
                '/Service.asmx',
                {
                    asymmetricMatch: XMLValidator.validate,
                },
                {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'text/xml',
                    SOAPAction: resources.retrieveDataExtension.action,
                }
            )
            .replyOnce(
                resources.retrieveDataExtension.status,
                resources.retrieveDataExtension.response
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
    it('failed: should fail to create 1 subscriber', async () => {
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
        } catch (ex) {
            assert.deepEqual(ex.JSON, resources.subscriberFailed.parsed);
            assert.lengthOf(mock.history.post, 2);
        }

        return;
    });
    it('create: should create 1 subscriber', async () => {
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
    it('update: should update 1 subscriber', async () => {
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
    it('expired: should return an error of expired token', async () => {
        //given
        addHandler(resources.expiredToken);
        // when
        try {
            await defaultSdk().soap.create('Subscriber', {
                SubscriberKey: '1234512345',
                EmailAddress: 'douglas@accenture.com',
            });
        } catch (ex) {
            // then
            assert.equal(ex.errorMessage, 'Token Expired');
            assert.lengthOf(mock.history.post, 4);
            return;
        }
        assert.fail();
    });
    it('bad Request: should return an error of bad request', async () => {
        //given
        addHandler(resources.badRequest);
        // when
        try {
            await defaultSdk().soap.create('Subscriber', {
                SubscriberKey: [[['value']]],
            });
        } catch (ex) {
            // then
            assert.equal(ex.response.data, 'Bad Request');
            assert.lengthOf(mock.history.post, 2);
            return;
        }
        assert.fail();
    });
    it('Delete: should delete a subscriber', async () => {
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
    it('Describe: should describe the subscriber type', async () => {
        //given
        addHandler(resources.subscriberDescribed);
        // when
        const response = await defaultSdk().soap.describe('Subscriber');
        // then
        assert.deepEqual(resources.subscriberDescribed.parsed, response);
        assert.lengthOf(mock.history.post, 2);
        return;
    });
    it('Execute: should unsubscribe subscriber', async () => {
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
    it('Perform: should unsubscribe subscriber', async () => {
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
    it('Schedule: should schedule an Automation', async () => {
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
    it('RETRY: should return 1 data extension, after a connection error', async () => {
        //given

        mock.onPost('/Service.asmx')
            .timeoutOnce()
            .onPost(
                '/Service.asmx',
                {
                    asymmetricMatch: XMLValidator.validate,
                },
                {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'text/xml',
                    SOAPAction: resources.retrieveDataExtension.action,
                }
            )
            .reply(
                resources.retrieveDataExtension.status,
                resources.retrieveDataExtension.response
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
    it('FAILED RETRY: should return error, after multiple connection error', async () => {
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
        } catch (ex) {
            // then
            assert.isTrue(isConnectionError(ex.code));
        }
        assert.lengthOf(mock.history.post, 3);
        return;
    });
});
