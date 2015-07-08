var logger = require('../app/logging').logger;
var u = require('../app/util');
var UserBiz = require('../models/UserBiz').model;
var Promise = require('bluebird');

var Service = {};

Service.load = function (id, callback) {
    UserBiz.findById(id).lean(true).exec(function (err, doc) {
        if (err) {
            logger.error('Fail to load userBiz [id=' + id + ']: ' + err);
            if (callback) callback(err);
            return;
        }

        logger.debug('Succeed to load  userBiz [id=' + id + ']');
        if (callback) callback(null, doc);
    })
};

Service.create = function (json, callback) {
    var userBiz = new UserBiz(json);
    userBiz.save(function (err, doc, numberAffected) {
        if (err) {
            if (callback) callback(err);
            return;
        }
        if (numberAffected) {
            logger.debug('Succeed to create userBiz: ' + require('util').inspect(doc) + '\r\n');
            if (callback) callback(null, doc);
        }
        else {
            logger.error('Fail to create userBiz: ' + require('util').inspect(doc) + '\r\n');
            if (callback) callback(new Error('Fail to create userBiz'));
        }
    });
};

Service.delete = function (id, callback) {
    UserBiz.findByIdAndRemove(id, function (err, doc) {
        if (err) {
            logger.error('Fail to delete userBiz [id=' + id + ']: ' + err);
            if (callback) callback(err);
            return;
        }

        logger.debug('Succeed to delete userBiz [id=' + id + ']');
        if (callback) callback(null, doc);
    });
};

Service.update = function (id, update, callback) {
    UserBiz.findByIdAndUpdate(id, update, {new: true}, function (err, result){
        if(err) {
            callback(err);
        } else {
            logger.debug('Succeed to update userBiz [id=' + id + ']');
            callback(null, result);
        }
    });
};

Service.find = function (params, callback) {
    var query = UserBiz.find();

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
    var query = UserBiz.find();

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

Service.loadUserClazz = function(userId, callback){
    UserBiz.findOne({user: userId}, {_id: 0, clazzes: 1}).populate('clazzes').exec(function(err, result){
        if(err) {
            logger.error('load user class error: ' + err);
            callback(err);
        }else{
            callback(null, result);
        }
    });
}

Service.addClazz = function(userId, clazzBrief, callback){
    UserBiz.findOneAndUpdate({user: userId}, {$addToSet: {clazzes: clazzBrief}}, function(err, doc){
        if(err) {
            logger.error('add class to userBiz error: ' + err);
            callback(err);
        }else{
            callback(null, doc);
        }
    });
}

Service = Promise.promisifyAll(Service);

module.exports = Service;

