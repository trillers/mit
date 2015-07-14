var QrHandler = require('../common/QrHandler');
var ClazzService = require('../../../services/ClazzService');
var UserService = require('../../../services/UserService');
var ClazzStudentService = require('../../../services/ClazzStudentService');
var wechatApi = require('../../../app/wechat/api').api;
var tutorMediaId = "";
var _replyMsg = "识别上面的二维码,可以添加您的小助手哦~";

var handle = function(message, user, res, replyMsg, qrChannel){
    var update = {
            wx_subscribe: 1,
            wx_subscribe_time: new Date(),
            $inc: {'subscribeCount': 1},
            role: 's'
        },
        clazzStudentId;

    UserService.update(user.id, update)
        .then(function(){
            return ClazzStudentService.create(user.id);
        })
        .then(function(clazzStudent){
            clazzStudentId = clazzStudent._id;
            return ClazzService.loadByQrChannelId(qrChannel._id);
        })
        .then(function(clazz){
            return ClazzService.addStudent(clazz._id, clazzStudentId, user.id);
        })
        .then(function(result){
            if(result){
                return pushTutorQrAsync(result);
            }else{
                throw new Error("class Failed to bind Student!");
            }
        })
        .then(function(result){
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
