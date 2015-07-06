var logger = require('morgan');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')

module.exports = function(router){
    router.use(logger('dev'));
    router.use(methodOverride());
    router.use(bodyParser.json());
    router.use(bodyParser.urlencoded({ extended: true }));
    router.use(cookieParser()); //TODO

};
