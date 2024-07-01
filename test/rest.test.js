import { assert } from 'chai';
import { defaultSdk, mock } from './utils.js';
import SDK from '../lib/index.js';
import * as resources from './resources/rest.js';
import { success, expired, unauthorized } from './resources/auth.js';
import { isConnectionError } from '../lib/util.js';

describe('rest', function () {
    beforeEach(function () {
        mock.onPost(success.url).reply(success.status, success.response);
    });

    afterEach(function () {
        mock.reset();
    });

    it('GET Bulk: should return 6 journey items', async function () {
        //given
        const { journeysPage1, journeysPage2 } = resources;
        mock.onGet(journeysPage1.url).reply(journeysPage1.status, journeysPage1.response);
        mock.onGet(journeysPage2.url).reply(journeysPage2.status, journeysPage2.response);
        // when
        const payload = await defaultSdk().rest.getBulk('interaction/v1/interactions', 5);
        // then
        assert.lengthOf(payload.items, 6);
        assert.lengthOf(mock.history.post, 1);
        assert.lengthOf(mock.history.get, 2);
        return;
    });

    it('GET Bulk: should return 9 keyword items', async function () {
        //given
        const { keywordPage1 } = resources;
        mock.onGet(keywordPage1.url).reply(keywordPage1.status, keywordPage1.response);
        // when
        const payload = await defaultSdk().rest.getBulk(
            '/legacy/v1/beta/mobile/keyword/?view=simple',
            10
        );
        // then
        assert.lengthOf(payload.entry, 9);
        assert.lengthOf(mock.history.post, 1);
        assert.lengthOf(mock.history.get, 1);
        return;
    });

    it('GET: should return 5 journey items', async function () {
        //given
        const { journeysPage1 } = resources;
        mock.onGet(journeysPage1.url).reply(journeysPage1.status, journeysPage1.response);
        // when
        const payload = await defaultSdk().rest.get(
            'interaction/v1/interactions?$pageSize=5&$page=1'
        );
        // then
        assert.lengthOf(payload.items, 5);
        assert.lengthOf(mock.history.post, 1);
        assert.lengthOf(mock.history.get, 1);
        return;
    });

    it('GETCOLLECTION: should return 2 identical payloads', async function () {
        //given
        const { journeysPage1 } = resources;
        mock.onGet(journeysPage1.url).reply(journeysPage1.status, journeysPage1.response);
        // when
        const payloads = await defaultSdk().rest.getCollection([
            'interaction/v1/interactions?$pageSize=5&$page=1',
            'interaction/v1/interactions?$pageSize=5&$page=1',
        ]);
        // then
        assert.lengthOf(payloads, 2);
        assert.deepEqual(payloads[0], payloads[1]);
        assert.lengthOf(mock.history.post, 1);
        assert.lengthOf(mock.history.get, 2);
        return;
    });

    it('POST: should create Event Definition', async function () {
        //given
        const { eventcreate } = resources;
        mock.onPost(eventcreate.url).reply(eventcreate.status, eventcreate.response);
        // when
        const payload = await defaultSdk().rest.post('interaction/v1/EventDefinitions', {
            type: 'APIEvent',
            name: 'ExampleEventToDelete',
            description: '',
            mode: 'Production',
            eventDefinitionKey: 'ExampleEventToDelete',
            schema: {
                name: 'ExampleEventToDelete',
                fields: [
                    {
                        name: 'ContactId',
                        dataType: 'Text',
                        maxLength: 18,
                        isNullable: false,
                        isPrimaryKey: true,
                    },
                ],
                sendableCustomObjectField: 'ContactId',
                sendableSubscriberField: '_SubscriberKey',
            },
            sourceApplicationExtensionId: '7db1f972-f8b7-49b6-91b5-fa218e13953d',
            isVisibleInPicker: true,
        });
        // then
        assert.deepEqual(payload, eventcreate.response);
        assert.lengthOf(mock.history.post, 2);
        return;
    });

    it('POST: should add an entry to a Data Extension', async function () {
        //given
        const { dataExtensionUpsert } = resources;
        mock.onPost(dataExtensionUpsert.url).reply(
            dataExtensionUpsert.status,
            dataExtensionUpsert.response
        );
        // when
        const payload = await defaultSdk().rest.post('hub/v1/dataevents/key:key/rowset', [
            { keys: { primaryKey: 1 }, values: { name: 'test' } },
        ]);
        // then
        assert.deepEqual(payload, dataExtensionUpsert.response);
        assert.lengthOf(mock.history.post, 2);
        return;
    });

    it('PUT: should update Event Definition', async function () {
        //given
        const { eventupdate } = resources;
        mock.onPut(eventupdate.url).reply(eventupdate.status, eventupdate.response);
        // when
        const payload = await defaultSdk().rest.put(
            'interaction/v1/eventdefinitions/6cb5ae19-8f0a-4f50-ad6e-0f9c9a32d5a5',
            {
                type: 'APIEvent',
                name: 'ExampleEventToDelete',
                description: '',
                mode: 'Production',
                eventDefinitionKey: 'ExampleEventToDelete',
                sourceApplicationExtensionId: '7db1f972-f8b7-49b6-91b5-fa218e13953d',
                isVisibleInPicker: true,
            }
        );
        // then
        assert.deepEqual(payload, eventupdate.response);
        assert.lengthOf(mock.history.post, 1);
        assert.lengthOf(mock.history.put, 1);
        return;
    });

    it('PATCH: should update Contact', async function () {
        //given
        const { contactPatch } = resources;
        mock.onPatch(contactPatch.url).reply(contactPatch.status, contactPatch.response);
        // when
        const payload = await defaultSdk().rest.patch('contacts/v1/contacts', {
            contactKey: '0039E00000DcvwjQAB',
            contactId: undefined,
            attributeSets: [
                {
                    name: 'MobileConnect Demographics',
                    items: [
                        {
                            values: [
                                {
                                    name: 'Mobile Number',
                                    value: '4915111408414',
                                },
                                {
                                    name: 'Status',
                                    value: '1',
                                },
                                {
                                    name: 'Priority',
                                    value: '1',
                                },
                                {
                                    name: 'Locale',
                                    value: 'DE',
                                },
                                {
                                    name: 'Created Date',
                                    value: '11/11/2015',
                                },
                                {
                                    name: 'Modified Date',
                                    value: '11/11/2015',
                                },
                            ],
                        },
                    ],
                },
            ],
        });
        // then
        assert.deepEqual(payload, contactPatch.response);
        assert.lengthOf(mock.history.post, 1);
        assert.lengthOf(mock.history.patch, 1);
        return;
    });

    it('DELETE: should delete Campaign', async function () {
        //given
        const { campaignDelete } = resources;
        mock.onDelete(campaignDelete.url).reply(campaignDelete.status, campaignDelete.response);
        // when
        const payload = await defaultSdk().rest.delete('hub/v1/campaigns/12656');
        // then
        assert.deepEqual(payload, campaignDelete.response);
        assert.lengthOf(mock.history.post, 1);
        assert.lengthOf(mock.history.delete, 1);
        return;
    });

    it('should retry auth one time on first failure then work', async function () {
        //given
        mock.reset(); // needed to avoid before hook being used
        mock.onPost(expired.url)
            .replyOnce(expired.status, expired.response)
            .onPost(success.url)
            .replyOnce(success.status, success.response);

        const { campaignDelete } = resources;
        mock.onDelete(campaignDelete.url).reply(campaignDelete.status, campaignDelete.response);
        // when
        const payload = await defaultSdk().rest.delete('hub/v1/campaigns/12656');
        // then
        assert.deepEqual(payload, campaignDelete.response);
        assert.lengthOf(mock.history.post, 2);
        assert.lengthOf(mock.history.delete, 1);
        return;
    });

    it('should retry auth one time on first failure then fail', async function () {
        //given
        mock.reset(); // needed to avoid before hook being used
        mock.onPost(unauthorized.url).reply(unauthorized.status, unauthorized.response);

        const { campaignDelete } = resources;
        mock.onDelete(campaignDelete.url).reply(campaignDelete.status, campaignDelete.response);
        try {
            // when
            await defaultSdk().rest.delete('hub/v1/campaigns/12656');
            assert.fail();
        } catch (error) {
            assert.deepEqual(error.response.data, unauthorized.response);
            assert.lengthOf(mock.history.post, 2);
            assert.lengthOf(mock.history.delete, 0);
        }
        return;
    });

    it('should fail to delete campaign', async function () {
        //given
        const { campaignFailed } = resources;
        mock.onDelete(campaignFailed.url).reply(campaignFailed.status, campaignFailed.response);
        // when
        try {
            await defaultSdk().rest.delete('hub/v1/campaigns/abc');
            assert.fail();
            // then
        } catch (error) {
            // console.log(ex.response);
            assert.equal(error.response.status, campaignFailed.status);
            assert.deepEqual(error.response.data, campaignFailed.response);
        }

        assert.lengthOf(mock.history.post, 1);
        assert.lengthOf(mock.history.delete, 1);
        return;
    });

    it('RETRY: should return 5 journey items, after a connection error', async function () {
        //given
        const { journeysPage1 } = resources;
        mock.onGet(journeysPage1.url)
            .timeoutOnce()
            .onGet(journeysPage1.url)
            .reply(journeysPage1.status, journeysPage1.response);
        // when
        const payload = await defaultSdk().rest.get(
            'interaction/v1/interactions?$pageSize=5&$page=1'
        );
        // then
        assert.lengthOf(payload.items, 5);
        assert.lengthOf(mock.history.post, 1);
        assert.lengthOf(mock.history.get, 2);
        return;
    });

    it('FAILED RETRY: should return error, after 2 connection timeout errors', async function () {
        //given
        const { journeysPage1 } = resources;
        mock.onGet(journeysPage1.url).timeout();
        // when
        try {
            await defaultSdk().rest.get('interaction/v1/interactions?$pageSize=5&$page=1');
            assert.fail();
        } catch (error) {
            // then
            assert.isTrue(isConnectionError(error.code));
        }
        assert.lengthOf(mock.history.post, 1);
        assert.lengthOf(mock.history.get, 2);

        return;
    });

    it('FAILED RETRY: should return error, after 2 ECONNRESET errors', async function () {
        //given
        const { journeysPage1 } = resources;

        mock.onGet(journeysPage1.url).reply(() => {
            // eslint-disable-next-line unicorn/error-message
            const connectionError = new Error();
            // @ts-expect-error
            connectionError.code = 'ECONNRESET';
            throw connectionError;
        });
        // when
        try {
            await defaultSdk().rest.get('interaction/v1/interactions?$pageSize=5&$page=1');
            assert.fail();
        } catch (error) {
            // then
            assert.isTrue(isConnectionError(error.code));
        }
        assert.lengthOf(mock.history.post, 1);
        assert.lengthOf(mock.history.get, 2);

        return;
    });

    it('LogRequest & Response: should run middleware for logging ', async function () {
        //given
        const { journeysPage1 } = resources;
        mock.onGet(journeysPage1.url).reply(journeysPage1.status, journeysPage1.response);
        // when
        /** @type {object} */
        let expectedRequest;
        /** @type {object} */
        let expectedResponse;
        const sdk = new SDK(
            {
                client_id: 'XXXXX',
                client_secret: 'YYYYYY',
                auth_url: 'https://mct0l7nxfq2r988t1kxfy8sc47ma.auth.marketingcloudapis.com/',
                account_id: 1111111,
            },
            {
                eventHandlers: {
                    logRequest: (requestObject) => {
                        expectedRequest = requestObject;
                    },

                    logResponse: (responseObject) => {
                        expectedResponse = responseObject;
                    },
                    onConnectionError: () => {
                        return;
                    },
                },
                retryOnConnectionError: true,
                requestAttempts: 2,
            }
        );
        // when
        await sdk.rest.get('interaction/v1/interactions?$pageSize=5&$page=1');
        // then
        assert.deepEqual(
            {
                method: 'GET',
                url: 'interaction/v1/interactions?$pageSize=5&$page=1',
                baseURL: 'https://mct0l7nxfq2r988t1kxfy8sc47ma.rest.marketingcloudapis.com/',
                headers: {
                    Authorization: 'Bearer TESTTOKEN',
                },
            },
            expectedRequest
        );
        assert.equal(200, expectedResponse.status);
        assert.equal(5, expectedResponse.data.items.length);
        return;
    });
});
