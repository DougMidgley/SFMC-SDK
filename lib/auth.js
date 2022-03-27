'use strict';

const axios = require('axios');
const { isConnectionError } = require('./util');
const AVAIALABLE_SCOPES = [
    'accounts_read',
    'accounts_write',
    'approvals_read',
    'approvals_write',
    'audiences_read',
    'audiences_write',
    'automations_execute',
    'automations_read',
    'automations_write',
    'calendar_read',
    'calendar_write',
    'campaign_read',
    'campaign_write',
    'contact_bu_mapping_create',
    'contact_bu_mapping_delete',
    'contact_bu_mapping_update',
    'contact_bu_mapping_view',
    'data_extensions_read',
    'data_extensions_write',
    'deep_linking_asset_delete',
    'deep_linking_asset_read',
    'deep_linking_asset_write',
    'deep_linking_settings_read',
    'deep_linking_settings_write',
    'dfu_configure',
    'documents_and_images_read',
    'documents_and_images_write',
    'email_read',
    'email_send',
    'email_write',
    'event_notification_callback_create',
    'event_notification_callback_delete',
    'event_notification_callback_read',
    'event_notification_callback_update',
    'event_notification_subscription_create',
    'event_notification_subscription_delete',
    'event_notification_subscription_read',
    'event_notification_subscription_update',
    'file_locations_read',
    'file_locations_write',
    'journeys_aspr',
    'journeys_delete',
    'journeys_execute',
    'journeys_read',
    'journeys_write',
    'key_manage_revoke',
    'key_manage_rotate',
    'key_manage_view',
    'list_and_subscribers_read',
    'list_and_subscribers_write',
    'marketing_cloud_connect_read',
    'marketing_cloud_connect_send',
    'marketing_cloud_connect_write',
    'offline',
    'ott_channels_read',
    'ott_channels_write',
    'ott_chat_messaging_read',
    'ott_chat_messaging_send',
    'package_manager_deploy',
    'package_manager_package',
    'push_read',
    'push_send',
    'push_write',
    'saved_content_read',
    'saved_content_write',
    'sms_read',
    'sms_send',
    'sms_write',
    'social_post',
    'social_publish',
    'social_read',
    'social_write',
    'tags_read',
    'tags_write',
    'tracking_events_read',
    'tracking_events_write',
    'users_read',
    'users_write',
    'web_publish',
    'web_read',
    'web_write',
    'webhooks_read',
    'webhooks_write',
    'workflows_read',
    'workflows_write',
];

module.exports = class Auth {
    /**
     * Creates an instance of Auth.
     *
     * @param {object} authObject Auth Payload
     * @param {string} authObject.client_id Client Id from SFMC config
     * @param {string} authObject.client_secret Client Secret from SFMC config
     * @param {number} authObject.account_id MID of Business Unit used for API Calls
     * @param {string} authObject.auth_url Auth URL from SFMC config
     * @param {Array<string>} [authObject.scope] Array of scopes used for requests
     * @param {object} options options for the SDK as a whole, for example collection of handler functions, or retry settings
     */
    constructor(authObject, options) {
        if (!authObject) {
            throw new Error('authObject are required. see readme.');
        } else if (!authObject.client_id) {
            throw new Error('client_id or client_secret is missing or invalid');
        } else if (typeof authObject.client_id !== 'string') {
            throw new Error('client_id or client_secret must be strings');
        } else if (!authObject.client_secret) {
            throw new Error('client_id or client_secret is missing or invalid');
        } else if (typeof authObject.client_secret !== 'string') {
            throw new Error('client_id or client_secret must be strings');
        } else if (!authObject.account_id) {
            throw new Error('account_id is missing or invalid');
        } else if (!Number.isInteger(Number.parseInt(authObject.account_id))) {
            throw new Error(
                'account_id must be an Integer (Integers in String format are accepted)'
            );
        } else if (!authObject.auth_url) {
            throw new Error('auth_url is missing or invalid');
        } else if (typeof authObject.auth_url !== 'string') {
            throw new Error('auth_url must be a string');
        } else if (
            !/https:\/\/[a-z0-9-]{28}\.auth\.marketingcloudapis\.com\//gm.test(authObject.auth_url)
        ) {
            throw new Error(
                'auth_url must be in format https://mcXXXXXXXXXXXXXXXXXXXXXXXXXX.auth.marketingcloudapis.com/'
            );
        } else if (authObject.scope && !Array.isArray(authObject.scope)) {
            throw new Error('Scope must be in array format');
        } else if (authObject.scope && getInvalidScopes(authObject.scope).length > 0) {
            throw new Error(
                getInvalidScopes(authObject.scope)
                    .map((val) => '"' + val + '"')
                    .join(',') + ' is/are invalid scope(s)'
            );
        }
        this.authObject = Object.assign(this.authObject || {}, authObject);
        this.options = options;
    }
    /**
     *
     *
     * @param {boolean} forceRefresh used to enforce a refresh of token
     * @param {number} remainingAttempts number of retries in case of issues
     * @returns {Promise<object>} current session information
     */
    async getAccessToken(forceRefresh, remainingAttempts) {
        if (remainingAttempts === undefined) {
            remainingAttempts = this.options.requestAttempts;
        }
        if (Boolean(forceRefresh) || _isExpired(this.authObject)) {
            try {
                remainingAttempts--;
                this.authObject = await _requestToken(this.authObject);
            } catch (ex) {
                if (
                    this.options.retryOnConnectionError &&
                    remainingAttempts > 0 &&
                    isConnectionError(ex.code)
                ) {
                    if (this.options?.eventHandlers?.onConnectionError) {
                        this.options.eventHandlers.onConnectionError(ex, remainingAttempts);
                    }
                    return this.getAccessToken(forceRefresh, remainingAttempts);
                } else {
                    throw ex;
                }
            }

            if (this.options?.eventHandlers?.onRefresh) {
                this.options.eventHandlers.onRefresh(this.authObject);
            }
        }
        return this.authObject;
    }

    /**
     * Helper to get back list of scopes supported by SDK
     * @returns {Array[String]} array of potential scopes
     */
    getSupportedScopes() {
        return AVAIALABLE_SCOPES;
    }
};
/**
 * @param {object} authObject Auth object
 * @returns {boolean} true if token is expired
 */
function _isExpired(authObject) {
    let expired = false;
    // if current atomic time is equal or after exp, or we don't have a token, return true
    if (
        (authObject.expiration && authObject.expiration <= process.hrtime()[0]) ||
        !authObject.access_token
    ) {
        expired = true;
    }

    return expired;
}
/**
 * @param {object} authObject Auth Object for api calls
 * @returns {Promise<object>} updated Auth Object
 */
async function _requestToken(authObject) {
    // TODO retry logic
    const payload = {
        grant_type: 'client_credentials',
        client_id: authObject.client_id,
        client_secret: authObject.client_secret,
        account_id: authObject.account_id,
    };
    if (authObject.scope && Array.isArray(authObject.scope)) {
        payload.scope = authObject.scope.join(' ');
    }
    const res = await axios({
        method: 'post',
        baseURL: authObject.auth_url,
        url: '/v2/token',
        data: payload,
    });
    return Object.assign(authObject, res.data, {
        expiration: process.hrtime()[0] + res.data.expires_in,
    });
}
/**
 * @param {Array<string>} scopes list of scopes requested for the auth
 * @returns {Array<string>} list of invalid scopes
 */
function getInvalidScopes(scopes) {
    return scopes.filter((scope) => !AVAIALABLE_SCOPES.includes(scope));
}
