var QrHandler = require('../common/QrHandler');
var ClazzService = require('../../../services/ClazzService');
var wechatApi = require('../../../app/wechat/api').api;
var tutorMediaId = "";
var _replyMsg = "识别上面的二维码,可以添加您的小助手哦~";
var handle = function(message, user, res, replyMsg, qrChannel){
    ClazzService.loadByQrChannelId(qrChannel._id)
        .then(function(clazz){
            return ClazzService.addStudent(clazz._id, user);
        })
        .then(function(result){
            if(result){
                //push qrchannel
                return pushTutorQnAsync(res);
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
    wechatApi.sendImage(user.openid, tutorMediaId, function(err, result){
        if(err){
            cb(err, null);
        }else{
            cb(null, result);
        }
    });
}

var pushTutorQnAsync = Promise.promisify(pushTutorQr);

module.exports = new QrHandler(true, 'SBC', handle);
