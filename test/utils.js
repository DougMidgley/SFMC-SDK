const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const SDK = require('../lib');
exports.mock = new MockAdapter(axios, { onNoMatch: 'throwException' });
exports.defaultSdk = () => {
    return new SDK(
        {
            client_id: 'XXXXX',
            client_secret: 'YYYYYY',
            auth_url: 'https://mct0l7nxfq2r988t1kxfy8sc47ma.auth.marketingcloudapis.com/',
            account_id: 1111111,
        },
        {
            eventHandlers: {
                logRequest: () => {
                    return;
                },

                logResponse: () => {
                    return;
                },
            },
            retryOnConnectionError: true,
            requestAttempts: 1,
        }
    );
};
