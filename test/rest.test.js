import { assert } from 'chai';
import { defaultSdk, makeResponse, connectionError } from './utils.js';
import SDK from '../lib/index.js';
import * as resources from './resources/rest.js';
import { success, expired, unauthorized } from './resources/auth.js';

import fetchMock from 'fetch-mock';

describe('rest', function () {
    beforeEach(function () {
        fetchMock.post(success.url, () => makeResponse(success));
    });

    afterEach(function () {
        fetchMock.reset();
    });

    it('GET Bulk: should return 6 journey items', async function () {
        //given
        const { journeysPage1, journeysPage2 } = resources;
        fetchMock.get(journeysPage1.url, () => makeResponse(journeysPage1));
        fetchMock.get(journeysPage2.url, () => makeResponse(journeysPage2));

        // when
        const payload = await defaultSdk().rest.getBulk('interaction/v1/interactions', 5);
        // then
        assert.lengthOf(payload.items, 6);
        assert.lengthOf(fetchMock.calls(undefined, { method: 'post' }), 1);
        assert.lengthOf(fetchMock.calls(undefined, { method: 'get' }), 2);
        return;
    });

    it('GET Bulk: should return 9 keyword items', async function () {
        //given
        const { keywordPage1 } = resources;
        fetchMock.get(keywordPage1.url, () => makeResponse(keywordPage1));
        // when
        const payload = await defaultSdk().rest.getBulk(
            '/legacy/v1/beta/mobile/keyword/?view=simple',
            10
        );
        // then
        assert.lengthOf(payload.entry, 9);
        assert.lengthOf(fetchMock.calls(undefined, { method: 'post' }), 1);
        assert.lengthOf(fetchMock.calls(undefined, { method: 'get' }), 1);
        return;
    });

    it('GET: should return 5 journey items', async function () {
        //given
        const { journeysPage1 } = resources;
        fetchMock.get(journeysPage1.url, () => makeResponse(journeysPage1));
        // when
        const payload = await defaultSdk().rest.get(
            'interaction/v1/interactions?$pageSize=5&$page=1'
        );
        // then
        assert.lengthOf(payload.items, 5);
        assert.lengthOf(fetchMock.calls(undefined, { method: 'post' }), 1);
        assert.lengthOf(fetchMock.calls(undefined, { method: 'get' }), 1);
        return;
    });

    it('GETCOLLECTION: should return 2 identical payloads', async function () {
        //given
        const { journeysPage1 } = resources;
        fetchMock.get(journeysPage1.url, () => makeResponse(journeysPage1));
        // when
        const payloads = await defaultSdk().rest.getCollection([
            'interaction/v1/interactions?$pageSize=5&$page=1',
            'interaction/v1/interactions?$pageSize=5&$page=1',
        ]);
        // then
        assert.lengthOf(payloads, 2);
        assert.deepEqual(payloads[0], payloads[1]);
        assert.lengthOf(fetchMock.calls(undefined, { method: 'post' }), 1);
        assert.lengthOf(fetchMock.calls(undefined, { method: 'get' }), 2);
        return;
    });

    it('POST: should create Event Definition', async function () {
        //given
        const { eventcreate } = resources;
        fetchMock.post(eventcreate.url, () => makeResponse(eventcreate));
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
        assert.lengthOf(fetchMock.calls(undefined, { method: 'post' }), 2);
        return;
    });

    it('POST: should add an entry to a Data Extension', async function () {
        //given
        const { dataExtensionUpsert } = resources;
        fetchMock.post(dataExtensionUpsert.url, () => makeResponse(dataExtensionUpsert));
        // when
        const payload = await defaultSdk().rest.post('hub/v1/dataevents/key:key/rowset', [
            { keys: { primaryKey: 1 }, values: { name: 'test' } },
        ]);
        // then
        assert.deepEqual(payload, dataExtensionUpsert.response);
        assert.lengthOf(fetchMock.calls(undefined, { method: 'post' }), 2);
        return;
    });

    it('PUT: should update Event Definition', async function () {
        //given
        const { eventupdate } = resources;
        fetchMock.put(eventupdate.url, () => makeResponse(eventupdate));
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
        assert.lengthOf(fetchMock.calls(undefined, { method: 'post' }), 1);
        assert.lengthOf(fetchMock.calls(undefined, { method: 'put' }), 1);
        return;
    });

    it('PATCH: should update Contact', async function () {
        //given
        const { contactPatch } = resources;
        fetchMock.patch(contactPatch.url, () => makeResponse(contactPatch));
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
        assert.lengthOf(fetchMock.calls(undefined, { method: 'post' }), 1);
        assert.lengthOf(fetchMock.calls(undefined, { method: 'patch' }), 1);
        return;
    });

    it('DELETE: should delete Campaign', async function () {
        //given
        const { campaignDelete } = resources;
        fetchMock.delete(campaignDelete.url, () => makeResponse(campaignDelete));
        // when
        const payload = await defaultSdk().rest.delete('hub/v1/campaigns/12656');
        // then
        assert.deepEqual(payload, campaignDelete.response);
        assert.lengthOf(fetchMock.calls(undefined, { method: 'post' }), 1);
        assert.lengthOf(fetchMock.calls(undefined, { method: 'delete' }), 1);
        return;
    });

    it('should retry auth one time on first failure then work', async function () {
        //given
        fetchMock.reset(); // needed to avoid before hook being used
        fetchMock
            .postOnce(expired.url, () => makeResponse(expired), { name: 'expired' })
            .post(success.url, () => makeResponse(success), { name: 'success' });

        const { campaignDelete } = resources;
        fetchMock.delete(campaignDelete.url, () => makeResponse(campaignDelete));
        // when
        const payload = await defaultSdk().rest.delete('hub/v1/campaigns/12656');
        // then
        assert.deepEqual(payload, campaignDelete.response);
        assert.lengthOf(fetchMock.calls(undefined, { method: 'post' }), 2);
        assert.lengthOf(fetchMock.calls(undefined, { method: 'delete' }), 1);
        return;
    });

    it('should retry auth one time on first failure then fail', async function () {
        //given
        fetchMock.reset(); // needed to avoid before hook being used
        fetchMock.post(unauthorized.url, () => makeResponse(unauthorized));

        const { campaignDelete } = resources;
        fetchMock.delete(campaignDelete.url, () => makeResponse(campaignDelete));
        try {
            // when
            await defaultSdk().rest.delete('hub/v1/campaigns/12656');
            assert.fail();
        } catch (error) {
            assert.deepEqual(error.json, unauthorized.response);
            assert.lengthOf(fetchMock.calls(undefined, { method: 'post' }), 2);
            assert.lengthOf(fetchMock.calls(undefined, { method: 'delete' }), 0);
        }
        return;
    });

    it('should fail to delete campaign', async function () {
        //given
        const { campaignFailed } = resources;
        fetchMock.post(unauthorized.url, () => makeResponse(unauthorized), {
            name: 'Unauthorized',
        });
        fetchMock.delete(campaignFailed.url, () => makeResponse(campaignFailed));
        // when
        try {
            await defaultSdk().rest.delete('hub/v1/campaigns/abc');
            assert.fail();
            // then
        } catch (error) {
            assert.equal(error.response.status, campaignFailed.status);
            assert.deepEqual(error.json, campaignFailed.response);
        }

        assert.lengthOf(fetchMock.calls(undefined, { method: 'post' }), 1);
        assert.lengthOf(fetchMock.calls(undefined, { method: 'delete' }), 1);
        return;
    });

    it('RETRY: should return 5 journey items, after a connection error', async function () {
        //given
        const { journeysPage1 } = resources;
        fetchMock
            .getOnce(journeysPage1.url, { throws: connectionError() }, { name: 'ConnectionIssue' })
            .get(journeysPage1.url, () => makeResponse(journeysPage1));
        // when
        const payload = await defaultSdk().rest.get(
            'interaction/v1/interactions?$pageSize=5&$page=1'
        );
        // then
        assert.lengthOf(payload.items, 5);
        assert.lengthOf(fetchMock.calls(undefined, { method: 'post' }), 1);
        assert.lengthOf(fetchMock.calls(undefined, { method: 'get' }), 2);
        return;
    });

    it('FAILED RETRY: should return error, after 2 connection Connection Issue errors', async function () {
        //given
        const { journeysPage1 } = resources;
        fetchMock.get(
            journeysPage1.url,
            { throws: connectionError() },
            { name: 'ConnectionIssue' }
        );
        // when
        try {
            await defaultSdk().rest.get('interaction/v1/interactions?$pageSize=5&$page=1');
            assert.fail();
        } catch (error) {
            // then
            assert.equal(error.code, 'ECONNRESET');
        }
        assert.lengthOf(fetchMock.calls(undefined, { method: 'post' }), 1);
        assert.lengthOf(fetchMock.calls(undefined, { method: 'get' }), 2);

        return;
    });

    it('LogRequest & Response: should run middleware for logging ', async function () {
        //given
        const { journeysPage1 } = resources;
        fetchMock.get(journeysPage1.url, () => makeResponse(journeysPage1));
        // when
        /** @type {object} */
        let actualRequest;
        /** @type {string} */
        let actualUrl;
        /** @type {object} */
        let actualResponse;
        const sdk = new SDK(
            {
                client_id: 'XXXXX',
                client_secret: 'YYYYYY',
                auth_url: 'https://mct0l7nxfq2r988t1kxfy8sc47ma.auth.marketingcloudapis.com/',
                account_id: 1111111,
            },
            {
                eventHandlers: {
                    logRequest: (requestUrl, requestObject) => {
                        actualUrl = requestUrl;
                        actualRequest = requestObject;
                    },

                    logResponse: (responseObject) => {
                        actualResponse = responseObject;
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
        assert.equal(
            // @ts-ignore
            actualUrl,
            'https://mct0l7nxfq2r988t1kxfy8sc47ma.rest.marketingcloudapis.com/interaction/v1/interactions?$pageSize=5&$page=1'
        );
        assert.deepEqual(actualRequest, {
            method: 'GET',
            headers: {
                Authorization: 'Bearer TESTTOKEN',
                'Content-Type': 'application/json',
            },
        });
        assert.equal(actualResponse.status, 200);
        assert.equal(actualResponse.data.items.length, 5);
        return;
    });
});
