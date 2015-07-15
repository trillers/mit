var QrHandler = require('../common/QrHandler');
var ClazzService = require('../../../services/ClazzService');
var ClazzBriefService = require('../../../services/ClazzBriefService');
var UserService = require('../../../services/UserService');
var UserBizService = require('../../../services/UserBizService');
var ClazzStudentService = require('../../../services/ClazzStudentService');
var wechatApi = require('../../../app/wechat/api').api;
var Promise = require('bluebird');
var tutorMediaId = "";
var _replyMsg = "识别上面的二维码,可以添加您的小助手哦~";

var handle = function(message, user, res, qrChannel){
    var update = {
            wx_subscribe: 1,
            wx_subscribe_time: new Date(),
            $inc: {'subscribeCount': 1},
            role: 's'
        },
        clazzStudentId;

    UserService.update(user.id, update)
        .then(function(){
            return ClazzStudentService.createAsync({user: user.id});
        })
        .then(function(clazzStudent){
            console.log("22222222222222222222")
            clazzStudentId = clazzStudent._id;
            return ClazzService.loadByQrChannelId(qrChannel._id);
        })
        .then(function(clazz){
            console.log("333333333333")
            return ClazzService.addStudent(clazz._id, clazzStudentId, user.id);
        })
        .then(function(clazz){
            console.log("44444444444444")
            return ClazzBriefService.loadByClazzIdAsync(clazz._id);
        })
        .then(function(clazzBrief){
            console.log("555555555555555")
            var userBiz = {
                user: user.id,
                clazzes: [clazzBrief._id]
            }
            return UserBizService.createAsync(userBiz);
        })
        .then(function(result){
            console.log("666666666666")
            if(result){
                return pushTutorQrAsync(result);
            }else{
                throw new Error("class Failed to bind Student!");
            }
        })
        .then(function(result){
            console.log("7777777777777")
            if(result){
                res.reply(_replyMsg);
            }else{
                throw new Error("class Failed to bind Student, reply msg failed");
            }
        })
        .catch(Error, function(err){
            console.log(err);
        });
};

function pushTutorQr(user, cb){
    wechatApi.sendImage(user.wx_openid, tutorMediaId, function(err, result){
        if(err){
            cb(err, null);
        }else{
            cb(null, result);
        }
    });
}

var pushTutorQrAsync = Promise.promisify(pushTutorQr);

module.exports = new QrHandler(true, 'SBC', handle);
