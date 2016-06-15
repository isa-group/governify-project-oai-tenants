'use strict';

var db =  require('../data');
var namespacesRef = db.getRef('/namespaces');

exports.tenantsGET = function(args, res, next) {
  /**
   * parameters expected in the args:
  * keyName (String)
  * keyValue (String)
  * namespace (String)
  **/
    if(args.keyName.value && args.keyValue.value && args.namespace.value ){
        var keyName = args.keyName.value;
        var keyValue = args.keyValue.value;
        var name = args.namespace.value;

        var ref = db.getRef('/namespaces/' + name + '/tenants');
        ref.once('value', function(tenants){
            if(tenants.val()){
                resolveTenantBy(keyName, keyValue, tenants.val(), (tenant) => {
                    if(tenant){
                        res.json(tenant);
                    }else {
                        res.status(404);
                        res.json(new error(404, "Not Found tenant with these values"));
                    }
                }, (err) => {
                    res.status(400);
                    res.json(new error(400, err));
                });
            }else {
                res.status(404);
                res.json(new error(404, "Not found namespace with " + name));
            }
        });

    }else {

        var name = args.namespace.value;
        var ref = db.getRef('/namespaces/' + name + '/tenants');
        ref.once('value', function(tenants){
            console.log(tenants.val());
            res.json(db.parseToArray(tenants.val()));
        });

    }

}

exports.tenantsPOST = function(args, res, next) {
  /**
   * parameters expected in the args:
  * tenant (newTenant)
  **/
  if(args.namespace.value && args.tenant.value.agreement){
      var name = args.namespace.value;
      var newTenant = args.tenant.value;
      var ref = db.getRef('/namespaces/' + name + '/tenants' );
      ref.once('value', function(snapshot){
          var tenant = null;
          for(var s in newTenant.scope){
              tenant = resolveTenantBy(s, newTenant.scope[s], snapshot.val(), ()=>{}, ()=>{});
              if(tenant != null) break;
          }
          if(tenant){
              var tenantRef = db.getRef('/namespaces/' + name + '/tenants/' + tenant._id );
              tenantRef.set(newTenant, (err)=>{
                  if(!err){
                      res.end();
                  }else {
                      res.status(500);
                      res.json(new error(500, err));
                  }
              });
          }else{
              ref.push().set(newTenant, (err) => {
                  if(!err){
                      res.end();
                  }else {
                      res.status(500);
                      res.json(new error(500, err));
                  }
              });
          }
      });

  }else {

      res.status(400);
      res.json(new error(400, "Bad request, you need to pass namespace and newTenant"));

  }

}

exports.tenantsIdDELETE = function(args, res, next) {
  /**
   * parameters expected in the args:
  * id (string)
  * namespace (string)
  **/
    if(args.id.value && args.namespace.value ){
        var name = args.namespace.value;
        var id = args.id.value;
        var ref = db.getRef('/namespaces/' + name + '/tenants/' + id);
        ref.remove((err)=>{
            if(!err)
                res.sendStatus(200);
            else{
                res.status(500);
                res.json(new error(500, err));
            }
        });
    }else {
        res.status(400);
        res.json(new error(400, "Bad request, you need to pass apikey or account in a query parameter"));
    }

}

function resolveTenantBy(keyName, keyValue, tenants, successCb, errorCb){
    var tenant = null
    try{

        for(var t in tenants){
            if(tenants[t].scope[keyName]){
                if(tenants[t].scope[keyName] === keyValue ){
                  tenants[t]._id = t;
                  tenant = tenants[t];
                  break;
                }
            }
        }
        if(tenant)
          successCb(tenants[t]);
        else {
          successCb(null);
        }
    }catch(e){
        errorCb(e.toString());
    }
    return tenant;
}

function error (code, message){
    this.code = code;
    this.message = message;
}

function tenant(sla, scope, requestedPayload){
    this.sla = sla,
    this.scope = scope;
}
