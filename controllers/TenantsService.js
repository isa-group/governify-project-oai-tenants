'use strict';

var database = require("../data");
var TenantsModel = database.models.tenants;
var config = require('../config');
var logger = config.logger;

exports.tenantsGET = function(args, res, next) {
  /**
   * parameters expected in the args:
  * keyName (String)
  * keyValue (String)
  * namespace (String)
  **/
    var keyName = args.keyName.value;
    var keyValue = args.keyValue.value;

    logger.info("( tenantsGET ) GET tenant request: ");

    var query = {};
    if(keyValue){
        query [ "scope." + keyName ] = keyValue;
    }

    logger.debug("mongodb query: " + JSON.stringify(query, null, 2));
    TenantsModel.find(query, (err, result)=>{
        res.json(result);
    });

}

exports.tenantsPOST = function(args, res, next) {
  /**
   * parameters expected in the args:
  * tenant (newTenant)
  **/
  var newTenant = args.tenant.value;

  logger.info("( tenantsPOST ) newTenant request: " + JSON.stringify(newTenant, null, 2));

  var query = {};
  for (var s in newTenant.scope){
      query[ "scope." + s ] = newTenant.scope[s];
  }

  TenantsModel.findOne(query, (err, result) =>{
      logger.debug("( tenantsPOST ) findOne info: " + JSON.stringify(result, null, 2));

      if(err) return res.status(500).json(new error(500, err.toString()));

      if(result) return res.status(400).json(new error(400, "Tenant with this information already exists"));

      new TenantsModel(newTenant).save( (err, result)=>{
          if( err ) return res.status(500).json(new error(500, err.toString()));

          res.end();
      });

  });

}

exports.tenantsIdDELETE = function(args, res, next) {
  /**
   * parameters expected in the args:
  * id (string)
  * namespace (string)
  **/
  var tenantId = args.id.value;

  logger.info("( tenantsIdDELETE ) delete tenant request: " + JSON.stringify(tenantId, null, 2));

  TenantsModel.remove({_id: tenantId}, (err, result) =>{
      if(err) return res.status(500).json(new error(500, err.toString()));

      logger.debug("remove info: " + JSON.stringify(result, null, 2));

      res.end();
  });

}

exports.tenantsIdPUT = function(args, res, next) {
  /**
   * parameters expected in the args:
  * id (string)
  * namespace (string)
  **/
  var tenantId = args.id.value;
  var newTenant = args.tenant.value;

  logger.info("( tenantsIdPUT ) update tenant request: " + JSON.stringify(tenantId, null, 2));

  var query = {};
  query["_id"] = tenantId;

  TenantsModel.update(query, newTenant, {upsert: true, multi: true}, (err, result) =>{
      if(err) return res.status(500).json(new error(500, err.toString()));

      logger.debug("update info: " + JSON.stringify(result, null, 2));

      res.end();
  });

}

function error (code, message){
    this.code = code;
    this.message = message;
}
