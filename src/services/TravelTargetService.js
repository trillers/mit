var logger = require('../app/logging').logger;
var u = require('../app/util');
var time = require('../app/time');
var UserMetaKv = require('../kvs/UserMeta');
var TravelTarget = require('../models/TravelTarget').model;
var TravelElement = require('../models/TravelElement').model;
var TravelSpot = require('../models/TravelSpot').model;
var Comment = require('../models/Comment').model;

var Service = {};

Service.load = function (id, callback) {
    TravelTarget.findById(id).lean(true).exec(function (err, doc) {
        if (err) {
            logger.error('Fail to load travel target [id=' + id + ']: ' + err);
            if (callback) callback(err);
            return;
        }

        logger.debug('Succeed to load travel target [id=' + id + ']');
        if (callback) callback(null, doc);
    });
};

Service.create = function (json, callback) {
    var tt = new TravelTarget(json);
    tt.save(function (err, doc, numberAffected) {
        if (err) {
            if (callback) callback(err);
            return;
        }
        if (numberAffected) {
            logger.debug('Succeed to create travel target: ' + require('util').inspect(doc) + '\r\n');
            if (callback) callback(null, doc);
        }
        else {
            logger.error('Fail to create travel target: ' + require('util').inspect(doc) + '\r\n');
            if (callback) callback(new Error('Fail to create travel target'));
        }
    });
};

Service.delete = function (id, callback) {
    TravelTarget.findByIdAndRemove(id, function (err, doc) {
        if (err) {
            logger.error('Fail to delete travel target [id=' + id + ']: ' + err);
            if (callback) callback(err);
            return;
        }

        logger.debug('Succeed to delete travel target [id=' + id + ']');
        if (callback) callback(null, doc);
    });
};

Service.update = function (id, update, callback) {
    TravelTarget.findById(id, function (err, doc) {
        if (err) {
            logger.error('Fail to update travel target [id=' + id + ']: ' + err);
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
                    logger.debug('Succeed to update travel target: ' + require('util').inspect(result) + '\r\n');
                    if (callback) callback(null, result);
                }
                else {
                    var errMsg = 'Fail to update travel target [id=' + id + '] with ' + require('util').inspect(update) + '\r\n';
                    logger.error(errMsg);
                    if (callback) callback(new Error(errMsg));
                }
            });
        }
        else {
            logger.debug('Fail to update travel target [id=' + id + '] because it does not exist');
            if (callback) callback(null, null);
        }

    });
};

Service.filter = function (params, callback) {
    var query = TravelTarget.find();

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

Service.like = function (uid, thingId, callback) {
    UserMetaKv.like(uid, thingId, function (err, ret) {
        if (err) {
            callback(err);
            return;
        }
        if (ret.action == 'like') {
            if (ret.result) TravelTarget.like(thingId, uid, callback);
        }
        else {
            if (ret.result) TravelTarget.unlike(thingId, uid, callback);
        }
    });
};

Service.addComment = function (thingId, comment, callback) {
    TravelTarget.findById(thingId, "_id comments", function (err, doc) {
        //TODO: error handling
        var now = time.currentTime();
        comment.crtOn = now;
        comment.updOn = now;
        doc.comments.unshift(comment);
        doc.save(function (err, doc, numAffected) {
            if (numAffected) {
                if (callback) callback(err, doc.comments[0]);
            }
            else {
                if (callback) callback(err, null);
            }
        });
    });
};

Service.listComments = function (thingId, callback) {
    TravelTarget.findById(thingId, "comments", function (err, doc) {
        //TODO: error handling
        Comment.populate(doc.comments, {path: "crtBy"}, callback);
    });
};

module.exports = Service;
