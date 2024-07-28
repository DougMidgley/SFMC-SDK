import SDK from 'sfmc-sdk';
const sfmc = new SDK({
    client_id: '71fzp43cyb1aksgflc159my0',
    client_secret: 'oDZE354QsMXzcFqKQlGgDiH1',
    auth_url: 'https://mct0l7nxfq2r988t1kxfy8sc47mq.auth.marketingcloudapis.com/',
    account_id: 7281698,
});
try {
    console.log(
        'OK',

        await sfmc.auth.getAccessToken()
    );
} catch (ex) {
    console.error('FAIL', ex);
}
