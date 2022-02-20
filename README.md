# Salesforce Marketing Cloud SDK

Modern library to handle various API tasks with Salesforce Marketing Cloud.

## Background

This library is based on the work in https://github.com/salesforce-marketingcloud/FuelSDK-Node which has not been updated for 2 years.
Due to the naming onf Fuel being removed from all Marketing it also sends the wrong message about what it does.

This library attempts to overcomes some of the complexity/shortcomings of the original work

-   Uses Axios instead of Request which is outdated/no longer supported
-   Assumes Server-Server Credentials due to being the overwhealming case
-   Assumes that OAuth2 is in place
-   Allows for both REST and SOAP methods
-   Is opinionated about how Auth should be managed (only accepts a standard Auth method)
-   Only uses Promises/Async-Await, no callbacks
-   Maintainers of the semi-official lib from Salesforce are not responsive
-   Allows for using a persisting credentials in an external app, then passing in
-   We expect parsing of SOAP payloads to be done outside of the SDK (not helper methods)

## Usage

### Authorization

Initializes the Auth Object in the SDK.
The SDK will automatically request a new token if none is valid.
the second parameter in the constructor is to allow for specific options such as events to execute a function. See the below example for supported events. This reduces the number of requests for token therefore increasing speed between executions (when testing was 2.5 seconds down to 1.5 seconds for one rest and one soap request)

```javascript
const SDK = require('sfmc-sdk');
const sfmc = new SDK(
    {
        client_id: 'XXXXX',
        client_secret: 'YYYYYY',
        auth_url: 'https://ZZZZZZZ.auth.marketingcloudapis.com/',
        account_id: 7281698,
    },
    {
        eventHandlers: {
            onLoop: (type, accumulator) => console.log('Looping', type, accumlator.length),
            onRefresh: (options) => console.log('RefreshingToken.', Options),
            logRequest: (req) => console.log(req),
            logResponse: (res) => console.log(res),
            onConnectionError: (ex, remainingAttempts) => console.log(ex.code, remainingAttempts)

        },
        requestAttempts : 1
        retryOnConnectionError: true
    }
);
```

Additionally, a list of supported scopes can be retrieved by using the auth.getSupportedScopes method.

```javascript
const scopes = sfmc.auth.getSupportedScopes();
```

### SOAP

SOAP currently only supports all the standard SOAP action types.
General format is

-   Object Name
-   Parameters/Object
-   Request Options

Some examples below

```javascript
const soapRetrieve = await sfmc.soap.retrieve('DataExtension', ['ObjectID'], {});
const soapRetrieveBulk = await sfmc.soap.retrieveBulk('DataExtension', ['ObjectID'], {
    filter: {
        leftOperand: 'CustomerKey',
        operator: 'equals',
        rightOperand: 'SOMEKEYHERE',
    },
}); // when you want to auto paginate
const soapCreate = await sfmc.soap.create(
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
const soapUpdate = await sfmc.soap.update(
    'Role',
    {
        CustomerKey: '12345123',
        Name: 'UpdatedName',
    },
    {}
);
const soapExecute = await sfmc.soap.execute(
    'LogUnsubEvent',
    [
        {
            SubscriberKey: '12345123',
            EmailAddress: 'example@example.com',
        },
    ],
    {}
);
```

### REST

REST supports GET, POST, PUT, PATCH and DELETE.

```javascript
const restResponse = await sfmc.rest.get('/interaction/v1/interactions');
const restResponse = await sfmc.rest.post('/interaction/v1/interactions', jsonPayload);
const restResponse = await sfmc.rest.patch('/interaction/v1/interactions/IDHERE', jsonPayload); // PUT ALSO
const restResponse = await sfmc.rest.delete('/interaction/v1/interactions/IDHERE');
const restResponse = await sfmc.rest.getBulk('/interaction/v1/interactions'); // auto-paginate based on $pageSize
const restResponse = await sfmc.rest.getCollection(
    ['/interaction/v1/interactions/213', '/interaction/v1/interactions/123'],
    3
); // parallel requests
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## To Do

-   Look at persisting access tokens across sessions as an option
-   Validation improvement

## License

[BSD-3](https://opensource.org/licenses/BSD-3-Clause)
