'use strict';

var url = require('url');


var Namespaces = require('./NamespacesService');


module.exports.namespacesPOST = function namespacesPOST (req, res, next) {
  Namespaces.namespacesPOST(req.swagger.params, res, next);
};

module.exports.namespacesGET = function namespacesGET (req, res, next) {
  Namespaces.namespacesGET(req.swagger.params, res, next);
};

module.exports.namespacesNameGET = function namespacesNameGET (req, res, next) {
  Namespaces.namespacesNameGET(req.swagger.params, res, next);
};

module.exports.namespacesNameDELETE = function namespacesNameDELETE (req, res, next) {
  Namespaces.namespacesNameDELETE(req.swagger.params, res, next);
};
