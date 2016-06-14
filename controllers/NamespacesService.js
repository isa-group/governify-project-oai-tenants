'use strict';

var db =  require('../data');
var ref = db.getRef('/namespaces');

exports.namespacesPOST = function(args, res, next) {
    /**
     * parameters expected in the args:
    * namespace (namespace)
    **/
    if(args.namespace.value.name){
        var name = args.namespace.value.name;
        var current = db.getRef('/namespaces/' + name);
        current.once("value", function(snap){
            if(!snap.exists()){
                current.set(new namespace(args.namespace.value.name, args.namespace.value.description), (error) => {
                      if(!error)
                          res.end();
                      else {
                          res.status(500);
                          res.json(new error(500, error));
                      }
                });
            }else{
                res.status(409);
                res.json(new error(409, "Conflict, The namespace already exists."));
            }
        });
    }else{
        res.status(400);
        res.json(new error(400, "Bad request, you need to pass requestInfo in the body"));
    }

}

exports.namespacesGET = function(args, res, next) {
    /**
     * parameters expected in the args:
    **/
    ref.once("value", function(data) {
        res.json(db.parseToArray(data.val()));
    });

}

exports.namespacesNameGET = function(args, res, next) {
    /**
     * parameters expected in the args:
     * name
    **/
    if(args.name.value){
        var name = args.name.value;

        var current = db.getRef('/namespaces/' + name);
        current.once("value", function(data){

            if(data.val()){
                var ret = data.val()
                ret.tenants = undefined;
                ret._id = name;
                res.json(ret);
            }else {
                res.status(404);
                res.json(new error(404, "Not found namespace with name = " + name));
            }

        });

    }else{
        res.status(400);
        res.json(new error(400, "Bad request, you need to pass requestInfo in the body"));
    }

}

exports.namespacesNameDELETE = function(args, res, next) {
    /**
     * parameters expected in the args:
     * name
    **/
    if(args.name.value){
        var name = args.name.value;

        var current = db.getRef('/namespaces/' + name);
        current.remove(function(err){
            if(!err){
              res.sendStatus(200);
            }else{
                res.status(500);
                res.json(new error(500, err));
            }
        });

    }else{
        res.status(400);
        res.json(new error(400, "Bad request, you need to pass requestInfo in the body"));
    }


}

function error (code, message){
    this.code = code;
    this.message = message;
}

function namespace(name, description){
    this.name = name;
    if(description)
      this.description = description;
    this.tenants = {};
}
