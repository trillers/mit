var logger = require('../app/logging').logger;
var u = require('../app/util');
var ClazzBrief = require('../models/ClazzBrief').model;
var Promise = require('bluebird');

var Service = {};

Service.load = function (id, callback) {
    ClazzBrief.findById(id).lean(true).exec(function (err, doc) {
        if (err) {
            logger.error('Fail to load class [id=' + id + ']: ' + err);
            if (callback) callback(err);
            return;
        }

        logger.debug('Succeed to load  [id=' + id + ']');
        if (callback) callback(null, doc);
    })
};

Service.loadByClazzId = function (id, callback) {
    ClazzBrief.findOne({clazz: id}).lean(true).exec(function (err, doc) {
        if (err) {
            logger.error('Fail to load classBrief [id=' + id + ']: ' + err);
            if (callback) callback(err);
            return;
        }

        logger.debug('Succeed to load classBrief  [id=' + id + ']');
        if (callback) callback(null, doc);
    })
};

Service.create = function (json, callback) {
    var clazzBrief = new ClazzBrief(json);
    clazzBrief.save(function (err, doc, numberAffected) {
        if (err) {
            if (callback) callback(err);
            return;
        }
        if (numberAffected) {
            logger.debug('Succeed to create clazzBrief: ' + require('util').inspect(doc) + '\r\n');
            if (callback) callback(null, doc);
        }
        else {
            logger.error('Fail to create clazzBrief: ' + require('util').inspect(doc) + '\r\n');
            if (callback) callback(new Error('Fail to create clazzBrief'));
        }
    });
};

Service.delete = function (id, callback) {
    ClazzBrief.findByIdAndRemove(id, function (err, doc) {
        if (err) {
            logger.error('Fail to delete clazzBrief [id=' + id + ']: ' + err);
            if (callback) callback(err);
            return;
        }

        logger.debug('Succeed to delete clazzBrief [id=' + id + ']');
        if (callback) callback(null, doc);
    });
};

Service.update = function (id, update, callback) {
    ClazzBrief.findByIdAndUpdate(id, update, {new: true}, function (err, result){
        if(err) {
            callback(err);
        } else {
            logger.debug('Succeed to update clazzBrief [id=' + id + ']');
            callback(null, result);
        }
    });
};

Service.find = function (params, callback) {
    var query = ClazzBrief.find();

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
    var query = ClazzBrief.find();

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
