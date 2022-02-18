const assert = require('chai').assert;
const SDK = require('../lib');
const { defaultSdk, mock } = require('./utils.js');
const resources = require('./resources/auth.json');
const { isConnectionError } = require('../lib/util');

describe('auth', () => {
    afterEach(() => {
        mock.reset();
    });
    it('should return an auth payload with token', async () => {
        //given
        const { success } = resources;

        //when
        mock.onPost(success.url).reply(success.status, success.response);
        const auth = await defaultSdk().auth.getAccessToken();
        // then
        assert.equal(auth.access_token, success.response.access_token);
        assert.lengthOf(mock.history.post, 1);
        return;
    });
    it('should return an auth payload with previous token and one request', async () => {
        //given
        const { success } = resources;
        mock.onPost(success.url).reply(success.status, success.response);
        // when
        const sdk = defaultSdk();
        await sdk.auth.getAccessToken();
        const auth = await sdk.auth.getAccessToken();
        // then
        assert.equal(auth.access_token, success.response.access_token);
        assert.lengthOf(mock.history.post, 1);
        return;
    });
    it('should return an unauthorized error', async () => {
        //given
        const { unauthorized } = resources;
        mock.onPost(unauthorized.url).reply(unauthorized.status, unauthorized.response);
        // when
        const auth = defaultSdk().auth.getAccessToken();
        // then
        try {
            await auth;
            assert.fail();
        } catch (ex) {
            assert.equal(ex.response.status, 401);
        }

        return;
    });
    it('should return an incorrect account_id error', async () => {
        try {
            //given
            sfmc = new SDK({
                client_id: 'XXXXX',
                client_secret: 'YYYYYY',
                auth_url: 'https://mct0l7nxfq2r988t1kxfy8sc47ma.auth.marketingcloudapis.com/',
                account_id: 'abc',
            });
            //then
            assert.fail();
        } catch (ex) {
            assert.equal(
                ex.message,
                'account_id must be an Integer (Integers in String format are accepted)'
            );
        }
        return;
    });
    it('should return an incorrect auth_url error', async () => {
        try {
            //given
            sfmc = new SDK({
                client_id: 'XXXXX',
                client_secret: 'YYYYYY',
                auth_url: 'https://x.auth.marketingcloudapis.com/',
                account_id: '1111111',
            });
            //then
            assert.fail();
        } catch (ex) {
            assert.equal(
                ex.message,
                'auth_url must be in format https://mcXXXXXXXXXXXXXXXXXXXXXXXXXX.auth.marketingcloudapis.com/'
            );
        }
        return;
    });
    it('should return an incorrect client_id error', async () => {
        try {
            //given
            sfmc = new SDK({
                client_id: '',
                client_secret: 'YYYYYY',
                auth_url: 'https://mct0l7nxfq2r988t1kxfy8sc47ma.auth.marketingcloudapis.com/',
                account_id: '1111111',
            });
            //then
            assert.fail();
        } catch (ex) {
            assert.equal(ex.message, 'client_id or client_secret is missing or invalid');
        }
        return;
    });
    it('should return an incorrect client_key error', async () => {
        try {
            //given
            sfmc = new SDK({
                client_id: 'XXXXX',
                client_secret: '',
                auth_url: 'https://mct0l7nxfq2r988t1kxfy8sc47ma.auth.marketingcloudapis.com/',
                account_id: '1111111',
            });
            //then
            assert.fail();
        } catch (ex) {
            assert.equal(ex.message, 'client_id or client_secret is missing or invalid');
        }
        return;
    });
    it('should return an invalid scope error', async () => {
        try {
            //given
            sfmc = new SDK({
                client_id: 'XXXXX',
                client_secret: 'YYYYYY',
                auth_url: 'https://mct0l7nxfq2r988t1kxfy8sc47ma.auth.marketingcloudapis.com/',
                account_id: '1111111',
                scope: ['somethingwrong'],
            });
            //then
            assert.fail();
        } catch (ex) {
            assert.equal(ex.message, '"somethingwrong" is/are invalid scope(s)');
        }
        return;
    });
    it('should return an invalid scope type error', async () => {
        try {
            //given
            sfmc = new SDK({
                client_id: 'XXXXX',
                client_secret: 'YYYYYY',
                auth_url: 'https://mct0l7nxfq2r988t1kxfy8sc47ma.auth.marketingcloudapis.com/',
                account_id: '1111111',
                scope: 'something',
            });
            //then
            assert.fail();
        } catch (ex) {
            assert.equal(ex.message, 'Scope must be in array format');
        }
        return;
    });

    it('RETRY: should return an success, after a connection issues', async () => {
        //given
        const { success } = resources;

        //when
        mock.onPost(success.url)
            .timeoutOnce()
            .onPost(success.url)
            .reply(success.status, success.response);
        const auth = await defaultSdk().auth.getAccessToken();
        // then
        assert.equal(auth.access_token, success.response.access_token);
        assert.lengthOf(mock.history.post, 2);
        return;
    });
    it('FAILED RETRY: should return an error, after multiple connection issues', async () => {
        //given
        const { success } = resources;

        //when
        mock.onPost(success.url).timeout();
        // when
        try {
            await defaultSdk().auth.getAccessToken();
            //then
            assert.fail();
        } catch (ex) {
            assert.isTrue(isConnectionError(ex.code));
        }
        assert.lengthOf(mock.history.post, 2);
        return;
    });
});
