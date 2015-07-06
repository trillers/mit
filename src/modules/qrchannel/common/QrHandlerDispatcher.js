var QrChannel = require('../models/QrChannel').model;
var MarketingCampaignService = require('../../../services/MarketingCampaignService');
var MarketingCampaignUserService = require('../../../services/MarketingCampaignUserService');
var u = require('../../../app/util');
var logger = require('../../../app/logging').logger;
var MarketingCampaignStrategy = require('../../../models/TypeRegistry').item('MarketingCampaignStrategy');
var QrHandlerDispatcher = function(){
    this.handlers = {};
    this.defaultHandler = null;
    this.nullHandler = null;
};

QrHandlerDispatcher.prototype.register = function(handler){
    var key = this.genKey(handler.forever, handler.type);
    this.handlers[key] = handler;
};

QrHandlerDispatcher.prototype.setDefaultHandler = function(handler){
    this.defaultHandler = handler;
};

QrHandlerDispatcher.prototype.setNullHandler = function(handler){
    this.nullHandler = handler;
};

QrHandlerDispatcher.prototype.genKey = function(forever, type){
    return (forever ? 'fv' : 'tm') + type;
};

//var env = require('settings').domain;
var strategiesMap = {
    'fs' : '欢迎关注"种子旅行"，以后找活动、发活动就来这里吧...\n\n<a href=\"http://www.zz365.com.cn/mc/firstsubscribe?mcuid=%%?%%\">点击领取红包...</a>',
    'sm' : '将抢红包活动分享至"朋友圈",你可以再获取一个红包呦:)\n\n<a href=\"http://www.zz365.com.cn/mc/sharemc?mcuid=%%?%%\">点击分享活动...</a>',
    'uf': ''
};
QrHandlerDispatcher.prototype.dispatch = function(message, user, res){
    var reply = "", mc, mcu, user = user;
    var me = this;
    MarketingCampaignService.getMCUAsync(user)
        .then(function(doc){
            mc = doc.mc;
            mcu = doc.mcu;
            for(var i = 0, len = mc.strategies.length; i < len; i++){
                console.log('==================================================');
                console.log(mc.strategies[i]);
                console.log(MarketingCampaignStrategy.FirstSubscribe.value());
                console.log((mc.strategies[i].name === MarketingCampaignStrategy.FirstSubscribe.value()) && (user.subscribeCount == 0));
                if((mc.strategies[i].name === MarketingCampaignStrategy.FirstSubscribe.value()) && (user.subscribeCount == 0)){
                    reply = u.appendLine(reply, strategiesMap[mc.strategies[i].name], mcu._id);
                }else if(mc.strategies[i].name !== MarketingCampaignStrategy.FirstSubscribe.value()) {
                    reply = u.appendLine(reply, strategiesMap[mc.strategies[i].name], mcu._id);
                }
            };
            (reply.length >= 2) && (reply = reply.substring(0, reply.length-2));
            console.log("-----------------" + reply);
            reply.trim() == '' && (reply = "哇哦~太好了！我们又多了一个新种子，你好哇/::D\n\n这里是喊人一起玩儿的好地方哦！看看身边的朋友都在玩儿什么，赶紧加入吧！你也可以出个点子，叫上朋友一起动起来！\n\n<a href=\"http://www.zz365.com.cn\">点此发布活动或者报名参加！</a>");

            if(!message.EventKey){
                me.defaultHandler && me.defaultHandler(message, user, res, reply, null);
            }
            else{
                var index = message.EventKey.indexOf("_") + 1;
                var sceneId = message.EventKey.substring(index);
                QrChannel.loadBySceneId(sceneId, function(err, qr){
                    if(err){
                        //TODO
                        return;
                    }
                    if(qr){
                        var key = me.genKey(qr.forever, qr.type);
                        var handler = me.handlers[key];
                        handler && handler.handle(message, user, res, reply, qr);
                    }
                    else{
                        me.nullHandler(message, user, res, reply, null);
                    }
                });
            }
        })
};


module.exports = QrHandlerDispatcher;
