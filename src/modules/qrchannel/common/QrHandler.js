var QrCodeKv = require('../kvs/QrCode');
var QrChannel = require('../models/QrChannel').model;
var wechat = require('../../../app/wechat/api');
var Promise = require('bluebird');
var logger = require('../../../app/logging').logger;

var QrHandler = function(forever, type, handle){
    this.forever = forever;
    this.type = type;
    this.handle = handle;
};

var createLimitQRCode = function(sceneId, callback){
    wechat.api.createLimitQRCode(sceneId, function(err, result){
        if(err){
            if(callback) callback(err);
        }
        else{
            if(callback) callback(null, result.ticket);
        }
    });
};

var createTempQRCode = function(sceneId, callback){
    wechat.api.createTmpQRCode(sceneId, 604800, function(err, result){
        if(err){
            if(callback) callback(err);
        }
        else{
            if(callback) callback(null, result.ticket);
        }
    });
};

var createLimitQRCodeAsync = Promise.promisify(createLimitQRCode);
var createTempQRCodeAsync = Promise.promisify(createTempQRCode);

QrHandler.prototype.create = function(customId, callback){
    var nextSceneFn = this.forever ? QrCodeKv.nextSceneIdAsync : QrCodeKv.nextTempSceneIdAsync;
    var createQrCode = this.forever ? createLimitQRCodeAsync : createTempQRCodeAsync;
    var qrChannel = new QrChannel({
        forever: this.forever,
        type: this.type,
        customId: customId
    });

    nextSceneFn()
        .then(function (sceneId) {
            qrChannel.scene_id = sceneId;
            return createQrCode(sceneId);
        })
        .then(function (ticket) {
            qrChannel.ticket = ticket;
            var date = new Date();
            qrChannel.expire = new Date(date.getTime() + 7*24*60*60*1000);
            return qrChannel;
        }).then(function(qrChannel){
            qrChannel.save(function (err, doc, numberAffected) {
                if (err) {
                    if (callback) callback(err);
                    return;
                }
                if (numberAffected) {
                    logger.debug('Succeed to create qrcode: ' + require('util').inspect(doc) + '\r\n');
                    if (callback) callback(null, doc);
                }
                else {
                    logger.error('Fail to create qrcode: ' + require('util').inspect(doc) + '\r\n');
                    if (callback) callback(new Error('Fail to create qrcode'));
                }
            });
        });
};


module.exports = QrHandler;

