var settings = require('mit-settings');
var logger = require('../app/logging').logger;
var token = require('../app/wechat/token');
var jsApiList = ['checkJsApi','chooseImage','previewImage','uploadImage','downloadImage','onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ','onMenuShareWeibo','getNetworkType'];

var env = settings.env.NODE_ENV;
var debug = env != 'production';

var wechatConfiguring = function (req, res, next) {
    var url = req.protocol + '://' + req.get('host') + req.originalUrl;
    req.app || (req.app = {});
    req.app.env = env;
    req.app.debug = debug;

    token.getJc({url: url, jsApiList: jsApiList, debug: debug})
        .then(function(jsConfig){
            req.app.jc = jsConfig;
            res.locals.__page.jc = jsConfig;
            next();
        })
        .catch(Error, function(e){
            logger.error('Fail to get jc: ' + e);
            next();
        })
};

module.exports = wechatConfiguring;