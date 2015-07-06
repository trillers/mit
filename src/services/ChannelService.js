var logger = require('../app/logging').logger;
var u = require('../app/util');
var time = require('../app/time');
var Channel = require('../models/Channel').model;
var MarketingChannel = require('../kvs/MarketingChannel');
var wechat = require('../app/wechat/api');
var Promise = require('bluebird');

var Service = {};

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

var createLimitQRCodeAsync = Promise.promisify(createLimitQRCode);

Service.load = function (id, callback) {
    Channel.findById(id).lean(true).exec(function (err, doc) {
        if (err) {
            logger.error('Fail to load channel [id=' + id + ']: ' + err);
            if (callback) callback(err);
            return;
        }

        logger.debug('Succeed to load channel [id=' + id + ']');
        if (callback) callback(null, doc);
    });
};

Service.create = function (json, callback) {
    var channel = new Channel(json);
    MarketingChannel.nextSceneIdAsync()
        .then(function (sceneId) {
            channel.scene_id = sceneId;
            return createLimitQRCodeAsync(sceneId);
        })
        .then(function (ticket) {
            channel.ticket = ticket;
            return channel;
        }).then(function(channel){
            channel.save(function (err, doc, numberAffected) {
                if (err) {
                    if (callback) callback(err);
                    return;
                }
                if (numberAffected) {
                    logger.debug('Succeed to create channel: ' + require('util').inspect(doc) + '\r\n');
                    if (callback) callback(null, doc);
                }
                else {
                    logger.error('Fail to create channel: ' + require('util').inspect(doc) + '\r\n');
                    if (callback) callback(new Error('Fail to create channel'));
                }
            });
        });
};

Service.delete = function (id, callback) {
    Channel.findByIdAndRemove(id, function (err, doc) {
        if (err) {
            logger.error('Fail to delete channel [id=' + id + ']: ' + err);
            if (callback) callback(err);
            return;
        }

        logger.debug('Succeed to delete channel [id=' + id + ']');
        if (callback) callback(null, doc);
    });
};

Service.update = function (id, update, callback) {
    Channel.findById(id, function (err, doc) {
        if (err) {
            logger.error('Fail to update channel [id=' + id + ']: ' + err);
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
                    logger.debug('Succeed to update channel: ' + require('util').inspect(result) + '\r\n');
                    if (callback) callback(null, result);
                }
                else {
                    var errMsg = 'Fail to update channel [id=' + id + '] with ' + require('util').inspect(update) + '\r\n';
                    logger.error(errMsg);
                    if (callback) callback(new Error(errMsg));
                }
            });
        }
        else {
            logger.debug('Fail to update channel [id=' + id + '] because it does not exist');
            if (callback) callback(null, null);
        }

    });
};

Service.find = function (params, callback) {
    var query = Channel.find();

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
    var query = Channel.find();

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

Service.loadChannelBySceneId = function(sceneId, callback) {
    Channel.findOne({'scene_id':sceneId}).lean(true).exec(function(err, doc){
        if (err) {
            callback(err);
            return;
        }

        if (callback) callback(null, doc);
    });
}

Service.follow = function(sceneId, callback){
    Channel.findOneAndUpdate({'scene_id':sceneId}, {$inc:{'follows': 1}}, function(err, doc){
        if(err){
            if(callback) callback(err);
        }
        if(callback) callback(null, doc);
    });
}

Service.unFollow = function(sceneId, callback){
    Channel.findOneAndUpdate({'scene_id':sceneId}, {$inc:{'unFollows': 1}}, function(err, doc){
        if(err){
            if(callback) callback(err);
        }
        if(callback) callback(null, doc);
    });
}

Service = Promise.promisifyAll(Service);

module.exports = Service;
