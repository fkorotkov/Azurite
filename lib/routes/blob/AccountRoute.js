'use strict';

const env = require('./../../core/env'),
    ContainerRequest = require('./../../model/blob/AzuriteContainerRequest'),
    Serializers = require('./../../xml/Serializers'),
    AzuriteRequest = require('./../../model/blob/AzuriteRequest'),
    Operations = require('./../../core/Constants').Operations;

/*
 * Route definitions for all operation on the 'Account' resource type.
 * See https://docs.microsoft.com/en-us/rest/api/storageservices/fileservices/blob-service-rest-api
 * for details on specification.
 */
module.exports = (app) => {
    app.route(`/${env.emulatedStorageAccountName}`)
        .get((req, res, next) => {
            if (req.query.comp === 'list') {
                req.azuriteOperation = Operations.Account.LIST_CONTAINERS;
                req.azuriteRequest = new ContainerRequest({ req: req });
            }
            if (req.query.comp === 'properties' && req.query.restype === 'service') {
                req.azuriteOperation = Operations.Account.GET_BLOB_SERVICE_PROPERTIES;
                req.azuriteRequest = new AzuriteRequest({ req: req });
            }
            next();
        })
        .put((req, res, next) => {
            if (req.query.comp === 'properties' && req.query.restype === 'service') {
                req.azuriteOperation = Operations.Account.SET_BLOB_SERVICE_PROPERTIES;
                Serializers.parseServiceProperties(req.body)
                    .then((result) => {
                        req.azuriteRequest = new AzuriteRequest({ req: req, payload: result });
                        next();
                    });
                return;
            }
            next();
        })
        .options((req, res, next) => {
            req.azuriteOperation = Operations.Account.PREFLIGHT_BLOB_REQUEST;
            req.azuriteRequest = new AzuriteRequest({ req: req });
            next();
        });
}