var config = require('../config');
var logger = config.logger;

var mongoose = require('mongoose');


var db = mongoose.connect(config.services.db.uri);

module.exports.db = db;

module.exports.db.connect = function (done) {
    mongoose.connection.on('error', (err) => {
        logger.info("( database ) Connection error.");
    });

    mongoose.connection.on('open', () => {
        logger.info("( database ) Successful connection.");
        done();
    });

}


module.exports.models = {
    tenants: mongoose.model("Tenants", new mongoose.Schema({
        agreement: {
            type: "string"
        },
        scope: {
            type: "object",
            additionalProperties: {
                type: "string"
            }
        }
    }, { versionKey: false }))
}

module.exports.parseToArray = function (object) {
    var ret = [];
    for (var o in object) {
        object[o]._id = o;
        object[o].tenants = undefined;
        ret.push(object[o]);
    }
    return ret;
}
