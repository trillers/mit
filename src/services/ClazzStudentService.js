var logger = require('../app/logging').logger;
var u = require('../app/util');
var ClazzStudent = require('../models/ClazzStudent').model;
var Promise = require('bluebird');

var Service = {};

Service.load = function (id, callback) {
    ClazzStudent.findById(id).lean(true).exec(function (err, doc) {
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
    var clazzStudent = new ClazzStudent(json);
    clazzStudent.save(function (err, doc, numberAffected) {
        if (err) {
            if (callback) callback(err);
            return;
        }
        if (numberAffected) {
            logger.debug('Succeed to create clazzStudent: ' + require('util').inspect(doc) + '\r\n');
            if (callback) callback(null, doc);
        }
        else {
            logger.error('Fail to create clazzStudent: ' + require('util').inspect(doc) + '\r\n');
            if (callback) callback(new Error('Fail to create clazzStudent'));
        }
    });
};

Service.delete = function (id, callback) {
    ClazzStudent.findByIdAndRemove(id, function (err, doc) {
        if (err) {
            logger.error('Fail to delete clazzStudent [id=' + id + ']: ' + err);
            if (callback) callback(err);
            return;
        }

        logger.debug('Succeed to delete clazzStudent [id=' + id + ']');
        if (callback) callback(null, doc);
    });
};

Service.updateByUserId = function (userId, update, callback) {
    ClazzStudent.update({user: userId}, update, {new: true, upsert: true}, function (err, result){
        if(err) {
            callback(err);
        } else {
            logger.debug('Succeed to update by userId clazzTeacher [id=' + userId + ']');
            callback(null, result);
        }
    });
};

Service.update = function (id, update, callback) {
    ClazzStudent.findByIdAndUpdate(id, update, {new: true}, function (err, result){
        if(err) {
            callback(err);
        } else {
            logger.debug('Succeed to update clazzStudent [id=' + id + ']');
            callback(null, result);
        }
    });
};

Service.find = function (params, callback) {
    var query = ClazzStudent.find();

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
    var query = ClazzStudent.find();

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
