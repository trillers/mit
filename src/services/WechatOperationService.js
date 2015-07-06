var logger = require('../app/logging').logger;
var WechatLog = require('../models/WechatLog').model;
var ChannelAnalysisService = require('./ChannelAnalysisService');
var ChannelService = require('./ChannelService');
var Service = {};

Service.logAction = function(msg, user, callback){
    var wechatLog = new WechatLog(msg);
    wechatLog.save(function (err, doc, numberAffected) {
        if (err) {
            logger.error('failed to save wechat logger :'+ err +' \r\n');
            return;
        }
        if (numberAffected) {
            logger.debug('Succeed to create wechat logger target \r\n');
        }
        else {
            logger.error('Fail to create wechat logger \r\n');
        }
    });

    switch (msg.Event){
        case 'subscribe':
            if(msg.EventKey){
                var index = msg.EventKey.indexOf("_") + 1;
                var sceneId = msg.EventKey.substring(index);
                var date = new Date();
                var cpDate = new Date(date.toLocaleDateString());
                ChannelService.loadChannelBySceneIdAsync(sceneId)
                    .then(function(channel){
                        if(!channel){
                            if(callback) callback('channel is null');
                            return ;
                        }
                        var condition = {
                            channelName: channel.channelName,
                            scene_id: channel.scene_id,
                            updateOn: {$gt: cpDate}
                        }

                        var doc = {
                            updateOn: date,
                            $inc: {totalFollows: 1}
                        }
                        if(user.subscribeCount == 0){
                            doc['$inc'].effectiveFollows = 1;
                        }

                        var option = {
                            upsert: true
                        }

                        ChannelAnalysisService.update(condition, doc, option, function(err, res) {
                           if(err){
                               logger.error('update ChannelAnalysis error: ' + err);
                               if(callback) callback(err);
                           } else {
                               logger.info('success to update ChannelAnalysis');
                               if(callback) callback(err, res);
                           }
                        });
                    });

            }
            break;
        case 'unsubscribe':
            if(parseInt(user.subscribeCount) == 1 && user.channelFrom && user.channelFrom != ''){
                var date = new Date();
                var cpDate = new Date(date.toLocaleDateString());
                ChannelService.loadChannelBySceneIdAsync(user.channelFrom)
                    .then(function(channel){
                        if(!channel){
                            if(callback) callback('channel is null');
                            return ;
                        }
                        var condition = {
                            channelName: channel.channelName,
                            scene_id: channel.scene_id,
                            updateOn: {$gt: cpDate}
                        }

                        var doc = {
                            updateOn: date,
                            $inc: {unFollows: 1}
                        }

                        var option = {
                            upsert: true
                        }

                        ChannelAnalysisService.update(condition, doc, option, function(err, res) {
                            if(err){
                                logger.error('update ChannelAnalysis error: ' + err);
                                if(callback) callback(err);
                            } else {
                                logger.info('success to update ChannelAnalysis');
                                if(callback) callback(err, res);
                            }
                        });
                    });
            }
            break;
    }
};

module.exports = Service;