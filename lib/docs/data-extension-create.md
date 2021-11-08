# Create Data Extensions

```javascript
const soapJSONPayload = {
    "Name": "Data Extension from sfmc-sdk API",
    "Description": "Data Extension from sfmc-sdk API",
    "CustomerKey": "Data Extension from sfmc-sdk API",
    "Fields": [{
            "Name": "SubscriberKey",
            "FieldType": "Text",
            "MaxLength": 254,
            "IsRequired": true,
            "IsPrimaryKey": true
        },
        {
            "Name": "EmailAddress",
            "FieldType": "EmailAddress",
            "IsRequired": true,
            "IsPrimaryKey": false
        }
    ],
    //Sendable Configurations
    "IsSendable": true,
    "IsTestable": true,
    "SendableDataExtensionField": {
        "Name": "EmailAddress"
    },
    // SubscriberField must be `Subscriber Key` or `Subscriber ID`
    "SendableSubscriberField": {
        "Name": "Subscriber Key"
    },
    //Retention Configurations
    "DataRetentionPeriodLength": 10,
    "DataRetentionPeriod": "Days",
    "RowBasedRetention": true,
    "ResetRetentionPeriodOnImport": false,
    "DeleteAtEndOfRetentionPeriod": false
}
```

# Notes
- If `IsPrimaryKey` is set to **true** then `IsRequired` must also be set to **true**
- `SendableSubscriberField` must have a value of either `Subscriber Key` or `Subscriber ID`
- If `RowBasedRetention` is set to **true** then `ResetRetentionPeriodOnImport` must be set to **false**