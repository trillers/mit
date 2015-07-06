var logger = require('../app/logging').logger;
var u = require('../app/util');
var time = require('../app/time');
var MarketingCampaign = require('../models/MarketingCampaign').model;
var MarketingCampaignUserService = require('./MarketingCampaignUserService');
var wechat = require('../app/wechat/api');
var Promise = require('bluebird');

var Service = {};

Service.loadByCode = function (code, callback) {
    MarketingCampaign.findOne({code: code}).lean(true).exec(function (err, doc) {
        if (err) {
            logger.error('Fail to load Marketing Campaign [code=' + code + ']: ' + err);
            if (callback) callback(err);
            return;
        }
        logger.debug('Succeed to load Marketing Campaign [code=' + code + ']');
        if (callback) {
            if (doc != null) return callback(null, doc);
            throw new Error('Has no such MarketingCampaign with Code ----' + code);
        }
    });
};

function createHelper(mc, user){
    console.log(user);
    var json = {
        campaign: mc._id,
        user: {
            id: user.id,
            openid: user.wx_openid,
            displayName: user.displayName
        },
        strategies: []
    };
    if(mc && mc.strategies){
        for(var i = 0,len = mc.strategies.length; i < len; i++){
            json['strategies'].push({id: mc.strategies[i]._id, name: mc.strategies[i].name});
        }
    }
    return MarketingCampaignUserService.createAsync(json);
}

Service.getMCU = function (user, callback) {
    var mc = null, mcu = null;
    Service.loadByCodeAsync('subscribe1433128294400')
        .then(function(mcdoc){
            mc = mcdoc;
            if(user.subscribeCount == 0){
                console.log('---this is a new user------');
                return createHelper(mc, user);
            }else{
                console.log('---this is a old user------');
                return MarketingCampaignUserService.loadByMUAsync(user._id, mc._id);
            }
        })
        .then(function(mcudoc){
            if(!mcudoc){
                console.log('---mcu is null------');
                return callback(null, {mc: mc,mcu: createHelper(mc, user)}) ;
            }
            return callback(null, {mc: mc, mcu: mcudoc});
        })
};

Service.create = function (json, callback) {
    var marketingCampaign = new MarketingCampaign(json);
    marketingCampaign.save(function (err, doc, numberAffected) {
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
    MarketingCampaign.findByIdAndRemove(id, function (err, doc) {
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
    MarketingCampaign.findById(id, function (err, doc) {
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
    var query = MarketingCampaign.find();

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
    var query = MarketingCampaign.find();

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


Service = Promise.promisifyAll(Service);

module.exports = Service;
