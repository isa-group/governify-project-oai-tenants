var firebase = require('firebase');

firebase.initializeApp({
  serviceAccount: "./data/supervisor-data-0fe333e994b9.json",
  databaseURL: "https://supervisor-data.firebaseio.com/"
});

var db = firebase.database();

module.exports.getRef = function (path){
    return db.ref(path);
}

module.exports.parseToArray = function (object){
    var ret = [];
    for(var o in object){
        object[o]._id = o;
        object[o].tenants = undefined; 
        ret.push(object[o]);
    }
    return ret;
}
