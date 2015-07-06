var time = require('./time');
var defaultPattern = 'yyyy-MM-dd hh:mm:ss'; //TODO: configure it settings
Date.prototype.format = function(pattern){
    if(!pattern){
        pattern = defaultPattern;
    }
    return time.format(this, pattern);
};

var ProductActivity = require('../models/ProductActivity');

module.exports = function(){
};