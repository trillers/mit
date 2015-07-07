var logger = require('../app/logging').logger;
var u = require('../app/util');
var Clazz = require('../models/Clazz').model;
var Promise = require('bluebird');

var Service = {};

Service.load = function (id, callback) {
    Clazz.findById(id).lean(true).exec(function (err, doc) {
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
    Clazz.findByIdAndUpdate(id, update, function (err, result){
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

Service = Promise.promisifyAll(Service);

module.exports = Service;

