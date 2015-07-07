var settings = require('mit-settings');
var express = require('express');
var service = require('../../services/UserService');
var wechat = require('wechat');
var WechatOperationService = require('../../services/WechatOperationService');
//var QrChannelDispatcher = require('../../modules/qrchannel');
var UserKv = require('../../kvs/User');
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

    var wechatMiddleware = wechat(tokenConfig)
        .text(function (message, req, res, next) {
            authenticator.ensureSignin(message, req, res, next, function(user){
                WechatOperationService.logAction(message);
                // TODO: add code here
                var fdStart = message.Content.indexOf('反馈');

                if (fdStart == 0){
                    res.reply('收到，非常感谢你的反馈！');
                }
                else {
                    res.reply('欢迎来到快乐种子！');
                }
            });
        })
        .image(function (message, req, res, next) {
            authenticator.ensureSignin(message, req, res, next, function(user){
                WechatOperationService.logAction(message);
                // TODO: add code here
                res.reply('欢迎来到快乐种子！');
            });
        })
        .voice(function (message, req, res, next) {
            authenticator.ensureSignin(message, req, res, next, function(user){
                WechatOperationService.logAction(message);
                // TODO: add code here
                res.reply('欢迎来到快乐种子！');
            });
        })
        .video(function (message, req, res, next) {
            authenticator.ensureSignin(message, req, res, next, function(user){
                WechatOperationService.logAction(message);
                // TODO: add code here
                res.reply('欢迎来到快乐种子！');
            });
        })
        .location(function (message, req, res, next) {
            authenticator.ensureSignin(message, req, res, next, function(user){
                WechatOperationService.logAction(message);
                // TODO: add code here
                res.reply('欢迎来到快乐种子！');
            });
        })
        .link(function (message, req, res, next) {
            authenticator.ensureSignin(message, req, res, next, function(user){
                WechatOperationService.logAction(message);
                // TODO: add code here
                res.reply('欢迎来到快乐种子！');
            });
        })
        .event(function (message, req, res, next) {
            authenticator.ensureSignin(message, req, res, next, function(user){
                WechatOperationService.logAction(message, user);
                switch (message.Event){
                    case 'subscribe':
                        //authenticator.clearAuthentication(req, res);
                        ///*
                        // * Set user flags to tell middleware to make user re-signin, when load spa page.
                        // */
                        //UserKv.setFlagResignin(user.wx_openid, true);
                        //var userMap = ['oniQet5i2l5zgu4AemSUSzfDQ7HE','oniQet_1wleWcgfOEZDswDxRYSDQ', 'oniQet5LyVZBpbBvlERaUdaj1ZPQ', 'oniQet-PfAlF63MjN46hq74Vww8I', 'oniQet-V-zTnLbMncUQpOgwjPAaI', 'oniQet1nqyhoQEn_F1UaAx9Ao2Ag', 'oniQet4OV-o4tdFTomuBqeVHu2YA', 'oniQetzTZYlDnvk8_hC2LhW0Z_Hk', 'oniQet1SgwdePiLUKBUG-mX8BLLk', 'oniQetyizIGdytiqNlDge6nvQSw0', 'oniQetxwGP6I8C4lbBkwRrTpleiE', 'oniQet-PhD0zE-JTNfE6RBLnx7BE', 'oniQet0xiIuvd3ancjT6ePHmE39s', 'oniQet27QIn0EfRgC8zzDN0H41TE', 'oniQetwaIJM32YAGtQ-bfi48JcPU' ];
                        ////var userMap = ['oqSpUuLkPbGwAmCX8vJslexU3n2Y', 'oqSpUuPj3KedXmlSo6Icg9EVHh4w', 'oqSpUuHK2Vj9DaL93eYqzLo4e6Ow', 'oqSpUuJR2MjzH3Iy2TEkx5MkJ7hE'];
                        //var testUser = userMap.indexOf(user.wx_openid) > -1;
                        //if(!testUser) {
                        //    var update = {
                        //        wx_subscribe: 1,
                        //        wx_subscribe_time: new Date(),
                        //        $inc: {'subscribeCount': 1}
                        //    };
                        //    var welcome = "哇哦~太好了！我们又多了一个新种子，你好哇/::D\n\n这里是喊人一起玩儿的好地方哦！看看身边的朋友都在玩儿什么，赶紧加入吧！你也可以出个点子，叫上朋友一起动起来！\n\n<a href=\"http://www.zz365.com.cn\">点此发布活动或者报名参加！</a>";
                        //    if(user.subscribeCount == 0 && message.EventKey){
                        //        var index = message.EventKey.indexOf("_") + 1;
                        //        var sceneId = message.EventKey.substring(index);
                        //        update.channelFrom = sceneId;
                        //
                        //        ChannelService.followAsync(sceneId)
                        //            .then(function(){
                        //               service.tempUpdate(user.id, update, function(err, result){
                        //                  if(err){
                        //                      logger.error('user subscribe event error ' + err);
                        //                  }
                        //                   res.reply(welcome);
                        //               });
                        //            });
                        //    } else {
                        //        service.tempUpdate(user.id, update, function(err, result){
                        //            if(err){
                        //                logger.error('user subscribe event error ' + err);
                        //            }
                        //            res.reply(welcome);
                        //        });
                        //    }
                        //} else {
                        //    QrChannelDispatcher.dispatch(message, user, res);
                        //}
                        break;
                    case 'unsubscribe':
                        //authenticator.clearAuthentication(req, res);
                        ///*
                        // * Set user flags to tell middleware to make user re-signin, when load spa page.
                        // */
                        //UserKv.setFlagResignin(user.wx_openid, true);
                        //
                        //var update = {};
                        //update.wx_subscribe = 0;
                        //if(parseInt(user.subscribeCount) == 1){
                        //    ChannelService.unFollowAsync(user.channelFrom)
                        //        .then(function(){
                        //            service.tempUpdate(user.id, update, function(err){
                        //                if(err){
                        //                    logger.error('unsubscribe event update user err' + err);
                        //                }
                        //                res.reply();
                        //            });
                        //        });
                        //} else {
                        //    service.tempUpdate(user.id, update, function(err){
                        //        if(err){
                        //            logger.error('unsubscribe event update user err' + err);
                        //        }
                        //        res.reply();
                        //    });
                        //}
                        break;
                    case 'LOCATION':
                        res.reply();
                        //logger.debug('sst: location, longitude:' + message.Longitude + ' latitude:' + message.Latitude + ' precision: ' + message.Precision);
                        //logger.debug('sst: fromUserName:' + message.FromUserName + ' createTime: ' + message.CreateTime);
                        //console.log('userid: ' + user.id);
                        //
                        //try {
                        //    service.updateLocation(message, user.id, function(err, doc){
                        //
                        //        logger.debug('updateLocation finished ' + doc);
                        //    });
                        //}
                        //catch(e){
                        //    logger.error('error: ' + e);
                        //}
                        break;
                    case 'CLICK':
                        if (message.EventKey=='suggestion'){
                            res.reply('亲爱的小伙伴有啥不满意的请尽管吐槽哦，小种子一定会虚心接受和改进！点击左下方的按钮切换到对话框，输入“反馈+反馈内容”发送即可。\n\n吐槽建议被采纳将有机会成为金种子用户哦！');
                        }
                        else if (message.EventKey=='ranking'){
                            res.reply('我抢到红包了！');
                        }
                        else{
                            res.reply('欢迎来到快乐种子！');
                        }
                        break;
                    default:
                        res.reply('欢迎来到快乐种子！'); //TODO:
                        break;
                }
            });
        })
        .middlewarify();

    router.use(wechatMiddleware);

    return router;
};