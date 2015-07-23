var settings = require('mit-settings');
var UserKv = require('../kvs/User');

var preprocess = function (req, res, next) {
    var user = req.session && req.session.user;
    var oid = user ? user.wx_openid : null;
    console.log('_____________________________');
    console.log(user);
    if(!oid){
        console.log('has open id');
        next();
        return;
    }
    UserKv.getFlagResigninAsync(oid)
        .then(function(resignin){
            console.log(resignin);
            if(resignin){
                req.session && (req.session.user = null);
                req.session && (req.session.authenticated = false);
                return UserKv.setFlagResigninAsync(oid, false);
            }
        })
        .then(function(){
            next();
        })
        .catch(Error, function(err){
            logger.error('Fail to signup or sigin with wechat oauth: ' + err);
            next();
        });
};

module.exports = preprocess;