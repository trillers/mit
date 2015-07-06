var ChannelAnalysis = require('../models/ChannelAnalysis').model;
var logger = require('../app/logging').logger;

var Service = {};

Service.update = function(conditions, doc, option, callback){
    ChannelAnalysis.update(conditions, doc, option, function(err, res){
        if(err) {
            logger.error('update ChannelAnalysis error: ' + err);
            if(callback) callback(err);
        } else {
            if(callback) callback(null, res);
        }
    });
}


module.exports = Service;

