var settings = require('mit-settings');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var util = require('util');
module.exports = function(router){
    router.use(logger('dev'));
    router.use(cookieParser());
};
