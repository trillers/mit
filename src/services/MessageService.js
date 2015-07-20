var logger = require('../app/logging').logger;
var u = require('../app/util');
var Message = require('../models/Message').model;
var Promise = require('bluebird');

var Service = {};

Service.load = function (id, callback) {
    Message.findById(id)
        .lean(true).exec(function (err, doc) {
            if (err) {
                logger.error('Fail to load message [id=' + id + ']: ' + err);
                if (callback) callback(err);
                return;
            }

            logger.debug('Succeed to load message  [id=' + id + ']');
            if (callback) callback(null, doc);
        })
};

Service.create = function (json, callback) {
    var message = new Message(json);
    message.save(function (err, doc, numberAffected) {
        if (err) {
            if (callback) callback(err);
            return;
        }
        if (numberAffected) {
            logger.debug('Succeed to create message: ' + require('util').inspect(doc) + '\r\n');
            if (callback) callback(null, doc);
        }
        else {
            logger.error('Fail to create message: ' + require('util').inspect(doc) + '\r\n');
            if (callback) callback(new Error('Fail to create clazz'));
        }
    });
};

Service.delete = function (id, callback) {
    Message.findByIdAndRemove(id, function (err, doc) {
        if (err) {
            logger.error('Fail to delete message [id=' + id + ']: ' + err);
            if (callback) callback(err);
            return;
        }

        logger.debug('Succeed to delete message [id=' + id + ']');
        if (callback) callback(null, doc);
    });
};

Service.update = function (id, update, callback) {
    Message.findByIdAndUpdate(id, update, {new: true})
        .exec(function (err, result){
            if(err) {
                callback(err);
            } else {
                logger.debug('Succeed to update message [id=' + id + ']');
                callback(null, result);
            }
        })
};

Service.find = function (params, callback) {
    var query = Message.find();

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
    var query = Message.find();

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

