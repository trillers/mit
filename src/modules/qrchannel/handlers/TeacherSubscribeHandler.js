var QrHandler = require('../common/QrHandler');
var UserService = require('../../../services/UserService');
var logger = require('../../../app/logging').logger;

var handle = function(message, user, res, qrChannel){
    //TODO: implementation
    var update = {
        wx_subscribe: 1,
        wx_subscribe_time: new Date(),
        $inc: {'subscribeCount': 1},
        role: 't'
    };

    UserService.update(user.id, update, function(err, result){
        if(err){
            logger.error('user subscribe event error ' + err);
        }
        var replyMsg = '欢迎老师来到跟谁学';
        res.reply(replyMsg);
    });
};

var handler = new QrHandler(true, 'TS', handle); //TS teacher subscribe handler

module.exports = handler;
