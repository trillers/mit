var logger = require('../app/logging').logger;
var u = require('../app/util');
var Clazz = require('../models/Clazz').model;
var UserBizService = require('./UserBizService');
var Promise = require('bluebird');

var Service = {};

Service.load = function (id, callback) {
    Clazz.findById(id).populate('qrChannel').populate('students').lean(true).exec(function (err, doc) {
        if (err) {
            logger.error('Fail to load class [id=' + id + ']: ' + err);
            if (callback) callback(err);
            return;
        }

        logger.debug('Succeed to load  [id=' + id + ']');
        if (callback) callback(null, doc);
    })
};

Service.create = function (json, callback) {
    var clazz = new Clazz(json);
    clazz.save(function (err, doc, numberAffected) {
        if (err) {
            if (callback) callback(err);
            return;
        }
        if (numberAffected) {
            logger.debug('Succeed to create clazz: ' + require('util').inspect(doc) + '\r\n');
            if (callback) callback(null, doc);
        }
        else {
            logger.error('Fail to create clazz: ' + require('util').inspect(doc) + '\r\n');
            if (callback) callback(new Error('Fail to create clazz'));
        }
    });
};

Service.delete = function (id, callback) {
    Clazz.findByIdAndRemove(id, function (err, doc) {
        if (err) {
            logger.error('Fail to delete clazz [id=' + id + ']: ' + err);
            if (callback) callback(err);
            return;
        }

        logger.debug('Succeed to delete clazz [id=' + id + ']');
        if (callback) callback(null, doc);
    });
};

Service.update = function (id, update, callback) {
    Clazz.findByIdAndUpdate(id, update, {new: true}, function (err, result){
        if(err) {
            callback(err);
        } else {
            logger.debug('Succeed to update clazz [id=' + id + ']');
            callback(null, result);
        }
    });
};

Service.find = function (params, callback) {
    var query = Clazz.find();

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
    var query = Clazz.find();

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
Service.loadByQrChannelId = function (qrChannelId, cb) {
    Clazz.findOne({ qrChannel: qrChannelId }, function (err, doc) {
        if (err) {
            return cb(err, null);
        }else{
            if (cb) cb(null, doc);
        }
    });
}

Service.addStudent = function(clazzId, clazzStudentId, userId, cb){
    Service.update(clazzId, {$addToSet: clazzStudentId}, function(err, doc){
        if(err) return cb(err);
        UserBizService.update(userId, {$addToSet: clazzId}, function(err, doc){
            if(err) return cb(err);
            return cb(null, doc);
        })
    })
}

Service.loadStudentsById = function(clazzId, cb){
    var query = Clazz.findById(clazzId);
    query.populate('students').lean(true).exec(function(err, doc){
        if(err) return cb(err);
        return cb(doc.students);
    });
}

Service = Promise.promisifyAll(Service);

module.exports = Service;

