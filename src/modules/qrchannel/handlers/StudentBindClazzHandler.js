var QrHandler = require('../common/QrHandler');
var ClazzService = require('../../../services/ClazzService');
var ClazzBriefService = require('../../../services/ClazzBriefService');
var UserService = require('../../../services/UserService');
var UserBizService = require('../../../services/UserBizService');
var ClazzStudentService = require('../../../services/ClazzStudentService');
var wechatApi = require('../../../app/wechat/api').api;
var Promise = require('bluebird');
var tutorMediaId = "9Qx2NY4keMALv37HdZ-XfJjCsNWy1w5l3Kmar0zJc2DBtBb1fFRa_nRUv57RFv4P";
var _replyMsg = "识别上面的二维码,可以添加您的小助手哦~";
var pushTutorQrAsync = Promise.promisify(pushTutorQr);

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
            console.log(qrChannel);
            clazzStudentId = clazzStudent._id;
            return ClazzService.loadByQrChannelIdAsync(qrChannel._id);
        })
        .then(function(clazz){
            console.log("-------------------------------")
            console.log(clazz)
            return ClazzService.addStudentAsync(clazz._id, clazzStudentId, user.id);
        })
        .then(function(clazz){
            console.log("44444444444444");
            console.log(clazz)
            return ClazzBriefService.loadByClazzIdAsync(clazz._id);
        })
        .then(function(clazzBrief){
            console.log("555555555555555");
            console.log(clazzBrief)
            var userBiz = {
                $addToSet: {clazzes: clazzBrief._id}
            }
            return UserBizService.updateByConditionAsync({user: user.id}, userBiz);
        })
        .then(function(userBiz){
            console.log("666666666666")
            if(userBiz){
                return pushTutorQrAsync(user);
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
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~");
    console.log(user);
    console.log(user.wx_openid)
    wechatApi.sendImage(user.wx_openid, tutorMediaId, function(err, result){
        if(err){
            cb(err, null);
        }else{
            cb(null, result);
        }
    });
}

module.exports = new QrHandler(true, 'SBC', handle);
