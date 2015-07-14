var logger = require('../app/logging').logger;
var u = require('../app/util');
var ClazzTeacher = require('../models/ClazzTeacher').model;
var Promise = require('bluebird');

var Service = {};

Service.loadById = function (id, callback) {
    ClazzTeacher.findById(id).populate('qrChannel').lean(true).exec(function (err, doc) {
        if (err) {
            logger.error('Fail to load class [id=' + id + ']: ' + err);
            if (callback) callback(err);
            return;
        }

        logger.debug('Succeed to load  [id=' + id + ']');
        if (callback) callback(null, doc);
    })
};

Service.loadByUserId = function (userId, callback) {
    ClazzTeacher.findOne({user: userId}).lean(true).exec(function (err, doc) {
        if (err) {
            logger.error('Fail to load class by user id [id=' + userId + ']: ' + err);
            if (callback) callback(err);
            return;
        }

        logger.debug('Succeed to load by user id  [id=' + userId + ']');
        if (callback) callback(null, doc);
    })
};

Service.create = function (json, callback) {
    var clazzTeacher = new ClazzTeacher(json);
    ClazzTeacher.findOneAndUpdate({user: clazzTeacher.user}, clazzTeacher, {new: true, upsert: true}, function (err, doc) {
        if (err) {
            logger.error('Fail to create clazzTeacher');
            if (callback) callback(err);
            return;
        }else {
            logger.debug('Succeed to create clazzTeacher: ' + require('util').inspect(doc) + '\r\n');
            if (callback) callback(null, doc);
        }
    });
};

Service.delete = function (id, callback) {
    ClazzTeacher.findByIdAndRemove(id, function (err, doc) {
        if (err) {
            logger.error('Fail to delete clazzTeacher [id=' + id + ']: ' + err);
            if (callback) callback(err);
            return;
        }

        logger.debug('Succeed to delete clazzTeacher [id=' + id + ']');
        if (callback) callback(null, doc);
    });
};

Service.update = function (id, update, callback) {
    ClazzTeacher.findByIdAndUpdate(id, update, {new: true}, function (err, result){
        if(err) {
            callback(err);
        } else {
            logger.debug('Succeed to update clazzTeacher [id=' + id + ']');
            callback(null, result);
        }
    });
};

Service.find = function (params, callback) {
    var query = ClazzTeacher.find();

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
    var query = ClazzTeacher.find();

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
