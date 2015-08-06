var settings = require('mit-settings');
var express = require('express');
var service = require('../../services/UserService');
var wechat = require('wechat');
var WechatOperationService = require('../../services/WechatOperationService');
var QrChannelDispatcher = require('../../modules/qrchannel');
var UserKv = require('../../kvs/User');
var CustomerServer = require('../../kvs/CustomerServerPool');
var productionMode = settings.env.mode == 'production';
var logger = require('../../app/logging').logger;
var tokenConfig = productionMode ? {
    token: settings.wechat.token,
    appid: settings.wechat.appKey,
    encodingAESKey: settings.wechat.encodingAESKey
} : settings.wechat.token;

var WechatAuthenticator = require('../../framework/WechatAuthenticator');
var authenticator = new WechatAuthenticator({});


module.exports = function(){
    var router = express.Router({strict: false});

    //use wechat middlewares
    require('../common/routes-wechat')(router);
    var wechatMiddleware = wechat(tokenConfig, function(req, res, next){
        console.log(req.weixin);
        next();
    }).middlewarify();

    router.use(wechatMiddleware);
    router.use(function(req, res, next){
        console.log(req.weixin)
    })
    return router;
    //var wechatMiddleware = wechat(tokenConfig)
    //    .text(function (message, req, res, next) {
    //        authenticator.ensureSignin(message, req, res, next, function(user){
    //            WechatOperationService.logAction(message);
    //            // TODO: add code here
    //            //var fdStart = message.Content.indexOf('反馈');
    //            //
    //            //if (fdStart == 0){
    //            //    res.reply('收到，非常感谢你的反馈！');
    //            //}
    //            //else {
    //            //    res.reply('欢迎来到快乐种子！');
    //            //}
    //            res.reply('');
    //            CustomerServer.loadCSSByOpenIdAsync(user.wx_openid)
    //                .then(function(css){
    //                    if(css){
    //                        css.emit('message', {'user': user, 'msg': message.content});
    //                    } else {
    //                        CustomerServer.loadCSByIdAsync('8G')
    //                            .then(function(cs){
    //                                console.log('==========');
    //                                console.log(cs);
    //                                CustomerServer.saveCSSByOpendIdAsync(user.wx_openid, cs)
    //                                    .then(function(){
    //                                        cs.emit('message', {'user': user, 'msg': message.content});
    //                                    });
    //                            });
    //                    }
    //                })
    //        });
    //    })
    //    .image(function (message, req, res, next) {
    //        authenticator.ensureSignin(message, req, res, next, function(user){
    //            WechatOperationService.logAction(message);
    //            // TODO: add code here
    //            res.reply('欢迎来到快乐种子！');
    //        });
    //    })
    //    .voice(function (message, req, res, next) {
    //        authenticator.ensureSignin(message, req, res, next, function(user){
    //            WechatOperationService.logAction(message);
    //            // TODO: add code here
    //            res.reply('欢迎来到快乐种子！');
    //        });
    //    })
    //    .video(function (message, req, res, next) {
    //        authenticator.ensureSignin(message, req, res, next, function(user){
    //            WechatOperationService.logAction(message);
    //            // TODO: add code here
    //            res.reply('欢迎来到快乐种子！');
    //        });
    //    })
    //    .location(function (message, req, res, next) {
    //        authenticator.ensureSignin(message, req, res, next, function(user){
    //            WechatOperationService.logAction(message);
    //            // TODO: add code here
    //            res.reply('欢迎来到快乐种子！');
    //        });
    //    })
    //    .link(function (message, req, res, next) {
    //        authenticator.ensureSignin(message, req, res, next, function(user){
    //            WechatOperationService.logAction(message);
    //            // TODO: add code here
    //            res.reply('欢迎来到快乐种子！');
    //        });
    //    })
    //    .event(function (message, req, res, next) {
    //        authenticator.ensureSignin(message, req, res, next, function(user){
    //            WechatOperationService.logAction(message, user);
    //            switch (message.Event){
    //                case 'subscribe':
    //                    authenticator.clearAuthentication(req, res);
    //                    UserKv.setFlagResignin(user.wx_openid, true);
    //                    QrChannelDispatcher.dispatch(message, user, res);
    //                case 'unsubscribe':
    //                    //authenticator.clearAuthentication(req, res);
    //                    ///*
    //                    // * Set user flags to tell middleware to make user re-signin, when load spa page.
    //                    // */
    //                    //UserKv.setFlagResignin(user.wx_openid, true);
    //                    //
    //                    //var update = {};
    //                    //update.wx_subscribe = 0;
    //                    //if(parseInt(user.subscribeCount) == 1){
    //                    //    ChannelService.unFollowAsync(user.channelFrom)
    //                    //        .then(function(){
    //                    //            service.tempUpdate(user.id, update, function(err){
    //                    //                if(err){
    //                    //                    logger.error('unsubscribe event update user err' + err);
    //                    //                }
    //                    //                res.reply();
    //                    //            });
    //                    //        });
    //                    //} else {
    //                    //    service.tempUpdate(user.id, update, function(err){
    //                    //        if(err){
    //                    //            logger.error('unsubscribe event update user err' + err);
    //                    //        }
    //                    //        res.reply();
    //                    //    });
    //                    //}
    //                    break;
    //                case 'LOCATION':
    //                    res.reply();
    //                    //logger.debug('sst: location, longitude:' + message.Longitude + ' latitude:' + message.Latitude + ' precision: ' + message.Precision);
    //                    //logger.debug('sst: fromUserName:' + message.FromUserName + ' createTime: ' + message.CreateTime);
    //                    //console.log('userid: ' + user.id);
    //                    //
    //                    //try {
    //                    //    service.updateLocation(message, user.id, function(err, doc){
    //                    //
    //                    //        logger.debug('updateLocation finished ' + doc);
    //                    //    });
    //                    //}
    //                    //catch(e){
    //                    //    logger.error('error: ' + e);
    //                    //}
    //                    break;
    //                case 'CLICK':
    //                    if (message.EventKey=='suggestion'){
    //                        res.reply('亲爱的小伙伴有啥不满意的请尽管吐槽哦，小种子一定会虚心接受和改进！点击左下方的按钮切换到对话框，输入“反馈+反馈内容”发送即可。\n\n吐槽建议被采纳将有机会成为金种子用户哦！');
    //                    }
    //                    else if (message.EventKey=='ranking'){
    //                        res.reply('我抢到红包了！');
    //                    }
    //                    else{
    //                        res.reply('欢迎来到快乐种子！');
    //                    }
    //                    break;
    //                default:
    //                    res.reply('欢迎来到快乐种子！'); //TODO:
    //                    break;
    //            }
    //        });
    //    })
    //    .middlewarify();
    //
    //router.use(wechatMiddleware);

    return router;
};