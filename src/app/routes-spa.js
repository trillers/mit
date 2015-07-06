var settings = require('mit-settings');
var logger = require('morgan');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var multer = require('multer');
var cookieParser = require('cookie-parser');
var authPreprocess = require('../middlewares/auth-preprocess');
var authFilterA = require('../middlewares/auth-filter-anonymously');
var authFilterB = require('../middlewares/auth-filter-formally');
var configureWechat = require('../middlewares/wechat-configuring');
var configureLocals = require('../middlewares/locals');
module.exports = function(router){
    router.use(logger('dev'));
    router.use(methodOverride());
    router.use(bodyParser.json());
    router.use(bodyParser.urlencoded({ extended: true }));
    router.use(multer());
    router.use(cookieParser());

    router.use(authPreprocess);
    router.use(authFilterA);
    router.use(authFilterB);

    router.use(configureLocals);
    router.use(configureWechat);

};
