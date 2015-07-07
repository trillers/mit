var settings = require('mit-settings');
var util = require('util');
var logger = require('../../app/logging').logger;
var ApiReturn = require('../../framework/ApiReturn');
var token = require('../../app/wechat/token');

module.exports = function(router){
    require('../../app/routes-api')(router);

    //jt - get js ticket
    router.get('/jt', function(req, res){
        var force = req.query.force && req.query.force=='true';
        token.generateGetJt(force)(function(err, jt){
            if(err){
                logger.error(err);
                res.status(200).json(ApiReturn.i().error(err.code, err.message));
            }
            else{
                res.status(200).json(ApiReturn.i().ok(jt));
            }
        });
    });

    //at - get access token
    router.get('/at', function(req, res){
        var force = req.query.force && req.query.force=='true';
        token.generateGetAt(force)(function(err, at){
            if(err){
                logger.error(err);
                res.status(200).json(ApiReturn.i().error(err.code, err.message));
            }
            else{
                res.status(200).json(ApiReturn.i().ok(at));
            }
        });
    });
};