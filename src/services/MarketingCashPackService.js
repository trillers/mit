var logger = require('../app/logging').logger;
var u = require('../app/util');
var inspect = require('util').inspect;
var time = require('../app/time');
var MarketingCashPack = require('../models/MarketingCashPack').model;
var wechat = require('../app/wechat/api');
var Promise = require('bluebird');
var Redpack = require('weixin-redpack').Redpack;
var Payment = require('weixin-enterprisepay').Payment;
var getCashPackInstance = require('../models/CashPackTemplate');
var getCashPayInstance = require('../models/CashPayTemplate');
var Service = {};
var MarketingCampaignUserService = require('../services/MarketingCampaignUserService');


Service.load = function (id, callback) {
    MarketingCashPack.findById(id).lean(true).exec(function (err, doc) {
        if (err) {
            logger.error('Fail to load Marketing Campaign [code=' + code + ']: ' + err);
            if (callback) callback(err);
            return;
        }
        logger.debug('Succeed to load Marketing Campaign [code=' + code + ']');
        if (callback) callback(null, doc);
    });
};

Service.sendCashPack = function(cashpack, callback){
    var redpack = Redpack(getCashPackInstance(cashpack));
    redpack.send({
        re_openid: cashpack.receiver.openid,
        nick_name: cashpack.receiver.displayName,
        act_name: cashpack.campaignName
    }, function(err, result){
        if(err) {
            logger.error("Failed to send CashPack ---------" + inspect(err));
            return callback(err, null);
        }
        logger.debug("CashPack is sended----------------" + inspect(result));
        return callback(null, result)
    })
};

Service.sendEnterprisePay = function(cashpack, callback){
    var payment = Payment(getCashPayInstance(cashpack));
    console.log(payment)
    payment.send({
        openid: cashpack.receiver.openid
    }, function(err, result){
        if(err) {
            logger.error("Failed to send CashPack ---------" + inspect(err));
            return callback(err, null);
        }
        logger.debug("CashPack is sended----------------" + inspect(result));
        return callback(null, result)
    })
}

Service.create = function (json, callback) {
    var marketingCashPack = new MarketingCashPack(json);
    marketingCashPack.save(function (err, doc, numberAffected) {
        if (err) {
            if (callback) callback(err);
            return;
        }
        if (numberAffected) {
            logger.debug('Succeed to create Marketing Campaign: ' + require('util').inspect(doc) + '\r\n');
            if (callback) callback(null, doc);
        }
        else {
            logger.error('Fail to create Marketing Campaign: ' + require('util').inspect(doc) + '\r\n');
            if (callback) callback(new Error('Fail to create Marketing Campaign'));
        }
    });
};

Service.delete = function (id, callback) {
    MarketingCashPack.findByIdAndRemove(id, function (err, doc) {
        if (err) {
            logger.error('Fail to delete Marketing Campaign [id=' + id + ']: ' + err);
            if (callback) callback(err);
            return;
        }
        logger.debug('Succeed to delete Marketing Campaign [id=' + id + ']');
        if (callback) callback(null, doc);
    });
};

Service.update = function (id, update, callback) {
    MarketingCashPack.findById(id, function (err, doc) {
        if (err) {
            logger.error('Fail to update Marketing Campaign [id=' + id + ']: ' + err);
            if (callback) callback(err);
            return;
        }
        if (doc) {
            u.extend(doc, update);
            doc.increment(); //TODO: do it in pre-save event
            doc.save(function (err, result, numberAffected) {
                if (err) {
                    if (callback) callback(err);
                    return;
                }
                if (numberAffected) {
                    logger.debug('Succeed to update Marketing Campaign: ' + require('util').inspect(result) + '\r\n');
                    if (callback) callback(null, result);
                }
                else {
                    var errMsg = 'Fail to update Marketing Campaign [id=' + id + '] with ' + require('util').inspect(update) + '\r\n';
                    logger.error(errMsg);
                    if (callback) callback(new Error(errMsg));
                }
            });
        }
        else {
            logger.debug('Fail to update Marketing Campaign [id=' + id + '] because it does not exist');
            if (callback) callback(null, null);
        }

    });
};

Service.find = function (params, callback) {
    var query = MarketingCashPack.find();

    if (params.options) {
        query.setOptions(params.options);
    }

    if (params.sort) {
        query.sort(params.sort);
    }

    if (params.page) {
        var skip = (params.page.no - 1) * params.page.size;
        var limit = params.page.size;
        if (skip) query.skip(skip);
        if (limit) query.limit(limit);
    }

    if (params.conditions) {
        query.find(params.conditions);
    }


    //TODO: specify select list, exclude comments in list view
    query.lean(true);
    query.exec(function (err, docs) {
        if (err) {
            callback(err);
            return;
        }

        if (callback) callback(null, docs);
    });
};

Service.filter = function (params, callback) {
    var query = MarketingCashPack.find();

    if (params.options) {
        query.setOptions(params.options);
    }

    if (params.sort) {
        query.sort(params.sort);
    }

    if (params.page) {
        var skip = (params.page.no - 1) * params.page.size;
        var limit = params.page.size;
        if (skip) query.skip(skip);
        if (limit) query.limit(limit);
    }

    if (params.conditions) {
        query.find(params.conditions);
    }
    query.lean(true);
    query.exec(function (err, docs) {
        if (err) {
            callback(err);
            return;
        }

        if (callback) callback(null, docs);
    });
};

Service.sendRedPackWrapper = function(mcu, min, max, wishing, cb){
    var campaignName, cashpack;
    campaignName = mcu.campaign.name;
    cashpack = {
        campaign: mcu.campaign._id,
        minValue: min,
        maxValue: max,
        receiver: {
            id: mcu.user.id._id,
            openid: mcu.user.id.wx_openid,
            displayName: mcu.user.id.displayName
        },
        wishing: wishing
    };
    cashpack['actualValue'] = function(){
        return this.minValue + parseInt((Math.random()* (this.maxValue - this.minValue)).toFixed(2), 10);
    }.call(cashpack);
    Service.createAsync(cashpack)
        .then(function(cashpackdoc){
            console.log(cashpackdoc);
            cashpackdoc['campaignName'] = campaignName;
            if(max <= 100) return Service.sendEnterprisePayAsync(cashpackdoc);
            return Service.sendCashPackAsync(cashpackdoc);
        })
        .then(function(result){
            return MarketingCampaignUserService.updateAsync(mcu._id, {$inc: {redPackCount: 1}});
        })
        .then(function(doc){
            cb(null, doc);
        })
}

Service = Promise.promisifyAll(Service);

module.exports = Service;

