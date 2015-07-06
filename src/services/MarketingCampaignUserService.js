var logger = require('../app/logging').logger;
var u = require('../app/util');
var time = require('../app/time');
var MarketingCampaignUser = require('../models/MarketingCampaignUser').model;
var Promise = require('bluebird');

var Service = {};

Service.load = function (mcuid, callback) {
    MarketingCampaignUser.findById(mcuid)
        .populate('user.id')
        .populate('campaign')
        .populate('strategies.id')
        .populate('user.qrChannel')
        .lean(true)
        .exec(function (err, doc) {
            if (err) {
                logger.error('Fail to load Marketing Campaign User [McId=' + mcuid + ']: ' + err);
                if (callback) callback(err);
                return;
            }
            logger.debug('Succeed to load Marketing Campaign [McId=,' + mcuid + ']');
            if (callback)  return callback(null, doc);
        });
};

Service.loadByMU = function (userid, mcid, callback) {
    MarketingCampaignUser.findOne({'user.id': userid, 'campaign': mcid})
        .populate('user.id')
        .populate('campaign')
        .populate('strategies.id')
        .lean(true)
        .exec(function (err, doc) {
            if (err) {
                logger.error('Fail to load Marketing Campaign User [id=' + userid + ', ' + mcid + ']: ' + err);
                if (callback) callback(err);
                return;
            }
            logger.debug('Succeed to load Marketing Campaign [MU=' + userid + ' ,' + mcid + ']');
            if (callback) {
                return callback(null, doc);
            }
        });
};

Service.findById = function (id, callback) {
    MarketingCampaignUser.findById(id)
        .populate('user.id')
        .populate('campaign')
        .populate('strategies.id')
        .lean(true)
        .exec(function (err, doc) {
            if (err) {
                logger.error('Fail to load Marketing Campaign User [MU=' + id +  ']: ' + err);
                if (callback) callback(err);
                return;
            }
            logger.debug('Succeed to load Marketing Campaign [MU=' + id +  ']');
            if (callback) {
                if (doc != null) return callback(null, doc);
                throw new Error('Has no such MarketingCampaign with MU ----' + id);
            }
        });
};

Service.findByQrChannel = function (condition, callback) {
    console.log('====== condition ===============');
    console.log(condition);
    MarketingCampaignUser.find(condition)
        .populate('user.id')
        .populate('campaign')
        .populate('strategies.id')
        .lean(true)
        .exec(function (err, doc) {
            if (err) {
                logger.error('Fail to load Marketing Campaign User : ' + err);
                if (callback) callback(err);
                return;
            }
            logger.debug('Succeed to load Marketing Campaign ');
            if (callback) {
                if (doc != null) return callback(null, doc);
                throw new Error('Has no such MarketingCampaign ');
            }
        });
};

Service.create = function (json, callback) {
    var marketingCampaignUser = new MarketingCampaignUser(json);
    marketingCampaignUser.save(function (err, doc, numberAffected) {
        if (err) {
            if (callback) callback(err);
            return;
        }
        if (numberAffected) {
            logger.debug('Succeed to create Marketing Campaign User: ' + require('util').inspect(doc) + '\r\n');
            if (callback) callback(null, doc);
        }
        else {
            logger.error('Fail to create Marketing Campaign User: ' + require('util').inspect(doc) + '\r\n');
            if (callback) callback(new Error('Fail to create Marketing Campaign'));
        }
    });

};

Service.delete = function (id, callback) {
    MarketingCampaignUser.findByIdAndRemove(id, function (err, doc) {
        if (err) {
            logger.error('Fail to delete Marketing Campaign User [id=' + id + ']: ' + err);
            if (callback) callback(err);
            return;
        }
        logger.debug('Succeed to delete Marketing Campaign User [id=' + id + ']');
        if (callback) callback(null, doc);
    });
};

Service.attendMc = function (mcuid, strategyName, callback) {
    MarketingCampaignUser.findById(mcuid, function(err, doc){
        if (err) {
            if(callback) return callback(err);
        }
        if (doc) {
            var currentStrategy = null;
            for (var i = 0, len = doc.strategies.length; i < len; i++){
                if(strategyName === doc.strategies[i].name){
                    currentStrategy = doc.strategies[i];
                    break;
                }
            }

            if(currentStrategy){
                if(!(currentStrategy.attended)){
                    currentStrategy.attended = true;
                    doc.increment(); //TODO: do it in pre-save event
                    doc.save(function (err, result, numberAffected) {
                        if (err) {
                            if (callback) callback(err);
                            return;
                        }
                        if (numberAffected) {
                            logger.debug('Succeed to update Marketing Campaign User: ' + require('util').inspect(result) + '\r\n');
                            if (callback) return callback(null, result);
                        }
                        else {
                            var errMsg = 'Failed to Make the User[' + doc.user.id + '] attend the Strategy[' + currentStrategy.name + ']';
                            logger.error(errMsg);
                            if (callback) return callback(new Error(errMsg));
                        }
                    });
                }else{
                    var errMsg = 'the User[' + doc.user.id + '] is already attend the Strategy[' + currentStrategy.name + ']';
                    console.log(errMsg);
                    if (callback) return callback(null, {errorCode: "you are already attended"});
                }
            }else{
                var errMsg = 'MarketingCampaignUser Update attendMc Abnormal, MCU has no such Current Strategy';
                logger.error(errMsg);
                if (callback) return callback(new Error(errMsg));
            }
            //var index = 0;
            //for (var i = 0, len = doc.strategies.length; i < len ;i++) {
            //    (function(i){
            //        index += 1;
            //        var currentStrategy = doc.strategies[i];
            //        if( strategyName === currentStrategy.name ){
            //            if(!(currentStrategy.attended)){
            //                currentStrategy.attended = true;
            //                doc.increment(); //TODO: do it in pre-save event
            //                doc.save(function (err, result, numberAffected) {
            //                    if (err) {
            //                        if (callback) callback(err);
            //                        return;
            //                    }
            //                    if (numberAffected) {
            //                        logger.debug('Succeed to update Marketing Campaign User: ' + require('util').inspect(result) + '\r\n');
            //                        if (callback) return callback(null, result);
            //                    }
            //                    else {
            //                        var errMsg = 'Failed to Make the User[' + doc.user.id + '] attend the Strategy[' + currentStrategy.name + ']';
            //                        logger.error(errMsg);
            //                        if (callback) return callback(new Error(errMsg));
            //                    }
            //                });
            //            }else{
            //                var errMsg = 'the User[' + doc.user.id + '] is already attend the Strategy[' + currentStrategy.name + ']';
            //                console.log(errMsg);
            //                if (callback) return callback(null, {errorCode: "you are already attended"});
            //            }
            //        }else{
            //            if(index === len){
            //                var errMsg = 'MarketingCampaignUser Update attendMc Abnormal, MCU has no such Current Strategy';
            //                logger.error(errMsg);
            //                if (callback) return callback(new Error(errMsg));
            //            }
            //        }
            //    })(i);
            //}
            //return callback(new Error("Failed to attend the MarketingCampaign For McuService------"), null);
        }else{
            return callback(new Error("Failed to find the Mcu Doc------"), null);
        }

    });
}

Service.update = function (id, update, callback) {
    MarketingCampaignUser.findByIdAndUpdate(id, update, function (err, doc) {
        if (err) {
            logger.error('Fail to update Marketing Campaign User [id=' + id + ']: ' + err);
            if (callback) callback(err);
            return;
        }
        logger.debug('Succeed to update Marketing Campaign User: ' + require('util').inspect(doc) + '\r\n');
        if (callback) callback(null, doc);
        //if (doc) {
        //    u.extend(doc, update);
        //    doc.increment(); //TODO: do it in pre-save event
        //    doc.save(function (err, result, numberAffected) {
        //        if (err) {
        //            if (callback) callback(err);
        //            return;
        //        }
        //        if (numberAffected) {
        //            logger.debug('Succeed to update Marketing Campaign User: ' + require('util').inspect(result) + '\r\n');
        //            if (callback) callback(null, result);
        //        }
        //        else {
        //            var errMsg = 'Fail to update Marketing Campaign User [id=' + id + '] with ' + require('util').inspect(update) + '\r\n';
        //            logger.error(errMsg);
        //            if (callback) callback(new Error(errMsg));
        //        }
        //    });
        //}
        //else {
        //    logger.debug('Fail to update Marketing Campaign User [id=' + id + '] because it does not exist');
        //    if (callback) callback(null, null);
        //}

    });
};

Service.find = function (params, callback) {
    var query = MarketingCampaignUser.find();

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
    query.populate('user.id')
        .populate('campaign')
        .populate('strategies.id');

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
    var query = MarketingCampaignUser.find();

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
