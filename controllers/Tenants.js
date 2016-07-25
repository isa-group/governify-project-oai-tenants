'use strict';

var url = require('url');


var Tenants = require('./TenantsService');


module.exports.tenantsPOST = function tenantsPOST (req, res, next) {
  Tenants.tenantsPOST(req.swagger.params, res, next);
};

module.exports.tenantsGET = function tenantsGET (req, res, next) {
  Tenants.tenantsGET(req.swagger.params, res, next);
};

module.exports.tenantsIdDELETE = function tenantsIdDELETE (req, res, next) {
  Tenants.tenantsIdDELETE(req.swagger.params, res, next);
};

module.exports.tenantsIdPUT = function tenantsIdPUT (req, res, next) {
  Tenants.tenantsIdPUT(req.swagger.params, res, next);
};
