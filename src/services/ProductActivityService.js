var logger = require('../app/logging').logger;
var u = require('../app/util');
var time = require('../app/time');
var Events = new require('../framework/service/Events');
var UserMetaKv = require('../kvs/UserMeta');
var ProductActivity = require('../models/ProductActivity').model;
var ProductActivityWorkflow = require('../models/ProductActivity').workflow;
var ProductActivityActions = require('../models/ProductActivity').actions;
var ProductActivityStatus = require('../models/TypeRegistry').ProductActivityStatus;
var wechat = require('../app/wechat/api');
var inspect = require('util').inspect;
var pushMessageService = require('./PushMessageService');
var util = require('util');
var ProductActivityApplication = require('../models/ProductActivityApplication').model;
var User = require('../models/User').model;
var Comment = require('../models/Comment').model;
var RandomNote = require('../models/RandomNote').model;

var Service = {};
Service.events = new Events();


Service.load = function (id, callback) {
    ProductActivity
        .findById(id)
        .populate('crtBy')
        .populate('updBy')
        //.populate('initiator')
        .populate('comments.commenter') //for comment list view
        .populate('randomNotes.initiator')
        .populate('applications.applicant') // for application list view
        .lean(true).exec(function (err, doc) {
            if (err) {
                logger.error('Fail to load product activity [id=' + id + ']: ' + err);
                if (callback) callback(err);
                return;
            }
            //waiting for Refactoring
            User.findById(doc.initiator).lean().exec(function(err, user){
                doc.userforHeadUrl = user || {};
                logger.debug('Succeed to load product activity [id=' + id + ']');
                if (callback) callback(null, doc);
            });

        });
};

Service.create = function (json, callback) {
    var me = this;
    var doc = new ProductActivity(json);
    doc.save(function (err, doc, numberAffected) {
        if (err) {
            if (callback) callback(err);
            return;
        }
        if (numberAffected) {
            logger.debug('Succeed to create product activity: ' + require('util').inspect
            (doc) + '\r\n');
            if (callback) {
                var uid = doc.initiator;
                var activityInfo = {
                    rank: doc.rank,
                    id: doc._id
                };
                UserMetaKv.addInitiatedActivity(uid, activityInfo, function(err, result){
                    //TODO: error handling
                    if(result){
                        callback(null, doc);
                    }
                    else{
                        callback(null, doc);//TODO: error handling
                    }
                });
                me.events.emit('after-create', doc);
            }
        }
        else {
            logger.error('Fail to create product activity: ' + require('util').inspect(doc)
            + '\r\n');
            if (callback) callback(new Error('Fail to create product activity'));
        }
    });
};

Service.delete = function (id, callback) {
    ProductActivity.findByIdAndRemove(id, function (err, doc) {
        if (err) {
            logger.error('Fail to delete product activity [id=' + id + ']: ' + err);
            if (callback) callback(err);
            return;
        }

        logger.debug('Succeed to delete product activity [id=' + id + ']');
        if (callback) callback(null, doc);
    });
};

Service.update = function (id, update, callback) {
    ProductActivity.findById(id, function (err, doc) {
        if (err) {
            logger.error('Fail to update product activity [id=' + id + ']: ' + err);
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
                    logger.debug('Succeed to update product activity: ' + require
                    ('util').inspect(result) + '\r\n');
                    if (callback) callback(null, result);
                }
                else {
                    var errMsg = 'Fail to update product activity [id=' + id + '] with ' +
                        require('util').inspect(update) + '\r\n';
                    logger.error(errMsg);
                    if (callback) callback(new Error(errMsg));
                }
            });
        }
        else {
            logger.debug('Fail to update product activity [id=' + id + '] because it does not exist');
            if (callback) callback(null, null);
        }

    });
};

Service.find = function (params, callback) {
    var query = ProductActivity.find();

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

    if(params.keyword){
        var reg = new RegExp(params.keyword, "i");
        query.find({name: reg});
    }

    if (params.conditions) {
        query.find(params.conditions);
    }

    //TODO: specify select list, exclude comments in list view
    query.lean(true);
    query.select('name place startTime reviewStatus status applications images meta tags.type c');
    query.exec(function (err, docs) {
        if (err) {
            callback(err);
            return;
        }

        if (callback) callback(null, docs);
    });
};

Service.filter = function (params, callback) {
    var query = ProductActivity.find();

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

Service.findInitiated = function (uid, callback) {
    var select = '_id reviewStatus status name images desc applications place startTime meta tags';
    UserMetaKv.getInitiatedActivities(uid, function(err, results){
        //TODO: error handling
        ProductActivity.find({'_id': {$in: results}}, select).sort({'rank': 'desc'}).lean
        (true).exec(callback);
    });
};

Service.findApplied = function (uid, callback) {
    var select = '_id reviewStatus status name images desc applications place startTime meta tags';
    UserMetaKv.getAppliedActivities(uid, function(err, results){
        //TODO: error handling
        ProductActivity.find({'_id': {$in: results}}, select).sort({'rank': 'desc'}).lean
        (true).exec(callback);
    });
};

Service.findLiked = function (uid, callback) {
    var select = '_id reviewStatus status name images desc applications place startTime meta tags';
    UserMetaKv.getLikedActivities(uid, function(err, results){
        //TODO: error handling
        ProductActivity.find({'_id': {$in: results}}, select).sort({'rank': 'desc'}).lean
        (true).exec(callback);
    });
};

Service.findStard = function (uid, callback) {
    var select = '_id reviewStatus status name images desc applications place startTime meta tags';
    UserMetaKv.getStarredActivities(uid, function(err, results){
        //TODO: error handling
        ProductActivity.find({'_id': {$in: results}, 'reviewStatus':{$ne: 'r'}, 'status':
        {$ne:'d'}}, select).sort({'rank': 'desc'}).lean(true).exec(callback);
    });
};

/**
 * add application to activity.
 * @param id activity id
 * @param applicationJson application json object
 * @param callback
 */
Service.addApplication = function (id, applicationJson, callback) {
    var me = this;
    var app = new ProductActivityApplication(applicationJson);
    var now = time.currentTime();
    var padoc = {};
    app.autoId();
    app.autoCreatedOn(now);
    app.autoUpdatedOn(now);
    app.autoRank();

    ProductActivity.findById(id, function (err, pa){
        if (err){
            if (callback) callback(err);
        }
        else{
            padoc = pa;
            pa.update(
                {
                    $push: {applications: app},
                    $set: {updOn: now},
                    $inc: {'meta.apps': app.num}
                }, function(err, doc){
                    if (err){
                        if (callback) callback(err);
                    }
                    else{
                        UserMetaKv.addAppliedActivity(app.applicant, {
                            rank: pa.rank,
                            id: pa._id
                        }, function (affected, result) {
                            //callback(err, app);
                            ProductActivity.findById(id, "applications", function (err,
                                                                                   doc) {
                                //TODO: error handling
                                ProductActivityApplication.populate(doc.applications,
                                    {path: "applicant"}, function(err,popeddoc){
                                        me.events.emit('after-applicate', {padoc: padoc,
                                            popeddoc: popeddoc});
                                        callback(err, popeddoc);
                                    });
                            });
                        });
                        //return app;

                    }


                }
            )
        }

    });
    /*
     return ProductActivity.findById(id).exec().
     then(function (pa) {
     padoc = pa;
     pa.update(
     {
     $push: {applications: app},
     $set: {updOn: now},
     $inc: {'meta.apps': app.num}
     }
     )
     .exec()
     .then(
     function (affected, doc) {
     UserMetaKv.addAppliedActivity(app.applicant, {
     rank: pa.rank,
     id: pa._id
     }, function (err, result) {
     //callback(err, app);
     ProductActivity.findById(id, "applications", function (err, doc) {
     //TODO: error handling
     ProductActivityApplication.populate(doc.applications, {path:
     "applicant"}, function(err,popeddoc){
     me.events.emit('after-applicate', {padoc: padoc, popeddoc:
     popeddoc});
     callback(err, popeddoc);
     });
     });
     });
     return app;
     },
     function (err) {
     if (callback) callback(err);
     });
     });
     */


};

/**
 * get the list of applications of a specified activity by id
 * @param id activity id
 * @param callback
 */
Service.listApplications = function (id, callback) {
    ProductActivity.findById(id, "applications", function (err, doc) {
        //TODO: error handling
        ProductActivityApplication.populate(doc.applications, {path: "applicant"},
            callback);
    });
};

Service.loadApplications = function (id, filter, callback) {
    ProductActivity
        .findById(id)
        .populate('applications.applicant') // for application list view
        .lean(true).exec(function (err, doc) {
            if (err) {
                logger.error('Fail to load product activity [id=' + id + ']: ' + err);
                if (callback) callback(err);
                return;
            }
            var length = (doc.applications.length < filter.page.size ? doc.applications.length : filter.page.size);
            var end = parseInt(length) + parseInt(filter.page.size * filter.page.no);
            if (callback) callback(err, doc.applications.slice(0, end));
        });
};

Service.findAndUpateApplications = function (id, apps, cb) {
    ProductActivity.update({"_id": id}, {$set: {"meta.apps": apps}}, function (err, doc) {
        return cb(err, doc);
    });
};

Service.like = function (uid, thingId, callback) {
    UserMetaKv.toggleLikeActivity(uid, thingId, function (err, ret) {
        if (err) {
            callback(err);
            return;
        }
        if (ret.undo) {
            ProductActivity.unlike(thingId, uid, callback);
        }
        else {
            ProductActivity.like(thingId, uid, callback);
        }
    });
};

Service.star = function (uid, thingId, callback) {
    UserMetaKv.toggleStarActivity(uid, thingId, function (err, ret) {
        if (err) {
            callback(err);
            return;
        }
        if (ret.undo) {
            ProductActivity.unstar(thingId, uid, callback);
        }
        else {
            ProductActivity.star(thingId, uid, callback);
        }
    });
};

Service.addComment = function (thingId, comment, callback) {
    var me = this;
    ProductActivity.findById(thingId, "_id crtOn updOn rank comments name initiator",
        function (err, doc) {
            //TODO: error handling
            doc.comments.unshift(comment);
            doc.save(function (err, doc, numAffected) {
                if (numAffected) {
                    if (callback) {
                        Comment.populate(doc.comments, {path: "commenter"}, function
                            (err,result){
                            if(Array.isArray(result) && result.length>0){
                                me.events.emit('after-comment', {comment: result[0], doc:doc});
                            }else{
                                callback(new Error("something wrong in comment,s Data structure"), result);
                            }
                            return callback(err,result);
                        });
                    }
                }
                else {
                    if (callback) callback(err, null);
                }
            });
        });
};

Service.deleteComment = function (id, cmId, callback) {
    ProductActivity.findById(id, function (err, doc) {
        if (err) {
            logger.error('Fail to update travel target [id=' + id + ']: ' + err);
            if (callback) callback(err);
            return;
        }
        if (doc) {
            doc.comments.forEach(function(cm, index, list){
                console.log(cm._id);
                if(cm._id == cmId){
                    doc.comments[index].remove();
                }
            });

            doc.save(function (err, result, numberAffected) {
                if (err) {
                    if (callback) callback(err);
                    return;
                }
                if (numberAffected) {
                    logger.debug('Succeed to update travel target: ' + require
                    ('util').inspect(result) + '\r\n');
                    if (callback) {
                        Comment.populate(result.comments, {path: "commenter"}, callback);
                    }
                }
                else {
                    var errMsg = 'Fail to update travel target [id=' + id + '] with ' +
                        require('util').inspect(update) + '\r\n';
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

Service.listComments = function (thingId, callback) {
    ProductActivity.findById(thingId, "comments", function (err, doc) {
        //TODO: error handling
        Comment.populate(doc.comments, {path: "commenter"}, callback);
    });
};

Service.addRandomNote = function (thingId, randomnote, callback) {
    var me = this;
    ProductActivity.findById(thingId, "_id randomNotes crtOn desc pics initiator", function
        (err, doc) {
        //TODO: error handling
        console.log("randomnote+++++++++++++++++++++++++++++++++++++++++");
        console.log(randomnote);
        doc.randomNotes.unshift(randomnote);
        doc.save(function (err, doc, numAffected) {
            if (numAffected) {
                if (callback) {
                    RandomNote.populate(doc.randomNotes, {path: "initiator"}, function
                        (err,result){
                        if(Array.isArray(result) && result.length>0){
                            //me.events.emit('after-random-note', {comment: result[0],doc:doc});
                    }else{
                        callback(new Error("something wrong in randomNotes,s Data structure"), result);
                    }
                    console.log("randomnotes----------------------------------------");
                    console.log(result);
                    return callback(err,result);
                });
            }
        }
        else {
            if (callback) callback(err, null);
        }
    });
});
};

Service.deleteRandomNote = function (id, cmId, callback) {
    ProductActivity.findById(id, function (err, doc) {
        if (err) {
            logger.error('Fail to delete random note [id=' + id + ']: ' + err);
            if (callback) callback(err);
            return;
        }
        if (doc) {
            doc.randomNotes.forEach(function(cm, index, list){
                console.log(cm._id);
                if(cm._id == cmId){
                    doc.randomNotes[index].remove();
                }
            });

            doc.save(function (err, result, numberAffected) {
                if (err) {
                    if (callback) callback(err);
                    return;
                }
                if (numberAffected) {
                    logger.debug('Succeed to delete random note: ' + require
                    ('util').inspect(result) + '\r\n');
                    if (callback) {
                        RandomNote.populate(result.randomNotes, {path: "initiator"},
                            callback);
                    }
                }
                else {
                    var errMsg = 'Fail to delete random note [id=' + id + '] with ' +
                        require('util').inspect(update) + '\r\n';
                    logger.error(errMsg);
                    if (callback) callback(new Error(errMsg));
                }
            });
        }
        else {
            logger.debug('Fail to delete random note [id=' + id + '] because it does not exist');
            if (callback) callback(null, null);
        }

    });
};

Service.listRandomNotes = function (thingId, callback) {
    ProductActivity.findById(thingId, "randomNotes", function (err, doc) {
        //TODO: error handling
        RandomNote.populate(doc.randomNotes, {path: "initiator"}, callback);
    });
};

/**
 * get a activity by imageid
 */
Service.findAndUpateImageShot = function(id,images,cb){
    ProductActivity.update({"_id":id},{$set:{"images":images}},function(err,padoc){
        return cb(err,padoc);
    });
};

Service.findAndUpateIntroImageShot = function(id,images,cb){
    ProductActivity.update({"_id":id},{$set:{"introImgs":images}},function(err,padoc){
        return cb(err,padoc);
    });
};

Service.getPublishStatusValue = function(){
    var currentStatus = ProductActivityStatus.Draft.name();
    var wf = ProductActivityWorkflow.newInstance(currentStatus);
    wf.actions().publish();
    wf.actions().approve();
    return ProductActivityStatus.names(wf.current())
};

Service[ProductActivityActions.stopApply] = function(thingId, callback){

    ProductActivity.findOne({_id: thingId}, "_id crtOn updBy updOn rank status", function
        (err, doc) {
        if(err){
            var errmsg = 'Fail to stopApply product activity: ' + err;
            logger.error(errmsg);
            callback(new Error(errmsg));
            return;
        }
        else if(!doc){
            var errmsg = 'Fail to stopApply product activity, activity does not exist or initiator is not correct';
            logger.error(errmsg);
            callback(new Error(errmsg));
            return;
        }
        var currentStatus = ProductActivityStatus.valueNames(doc.status);
        var wf = ProductActivityWorkflow.newInstance(currentStatus, doc);
        try{
            wf.actions().stopApply();
            if(wf.changed() && wf.current()==ProductActivityStatus.Ready.name()){
                doc.status = ProductActivityStatus.names(wf.current());
                doc.updOn = time.currentTime();
                doc.save(function(err){
                    if(err){
                        callback(err);
                    }
                    else{
                        callback(null, true);
                    }
                });
            }
            else{
                callback(null, false);
            }
        }
        catch(e){
            var errmsg = 'Fail to stopApply product activity: ' + e;
            logger.error(errmsg);
            callback(new Error(errmsg));
        }
    });
};

Service[ProductActivityActions.act] = function(thingId, callback){

    ProductActivity.findOne({_id: thingId}, "_id crtOn updBy updOn rank status", function
        (err, doc) {
        if(err){
            var errmsg = 'Fail to act product activity: ' + err;
            logger.error(errmsg);
            callback(new Error(errmsg));
            return;
        }
        else if(!doc){
            var errmsg = 'Fail to act product activity, activity does not exist or initiator is not correct';
            logger.error(errmsg);
            callback(new Error(errmsg));
            return;
        }
        var currentStatus = ProductActivityStatus.valueNames(doc.status);
        var wf = ProductActivityWorkflow.newInstance(currentStatus, doc);
        try{
            wf.actions().act();
            if(wf.changed() && wf.current()==ProductActivityStatus.Acting.name()){
                doc.status = ProductActivityStatus.names(wf.current());
                doc.updOn = time.currentTime();
                doc.save(function(err){
                    if(err){
                        callback(err);
                    }
                    else{
                        callback(null, true);
                    }
                });
            }
            else{
                callback(null, false);
            }
        }
        catch(e){
            var errmsg = 'Fail to act product activity: ' + e;
            logger.error(errmsg);
            callback(new Error(errmsg));
        }
    });
};

Service[ProductActivityActions.complete] = function(thingId, callback){

    ProductActivity.findOne({_id: thingId}, "_id crtOn updBy updOn rank priorityRank status", function (err, doc) {
    if(err){
        var errmsg = 'Fail to complete product activity: ' + err;
        logger.error(errmsg);
        callback(new Error(errmsg));
        return;
    }
    else if(!doc){
        var errmsg = 'Fail to complete product activity, activity does not exist or initiator is not correct';
        logger.error(errmsg);
        callback(new Error(errmsg));
        return;
    }
    var currentStatus = ProductActivityStatus.valueNames(doc.status);
    var wf = ProductActivityWorkflow.newInstance(currentStatus, doc);
    try{
        wf.actions().complete();
        if(wf.changed() && wf.current()==ProductActivityStatus.Completed.name()){
            doc.status = ProductActivityStatus.names(wf.current());
            doc.priorityRank = 0;
            doc.updOn = time.currentTime();
            doc.save(function(err){
                if(err){
                    callback(err);
                }
                else{
                    callback(null, true);
                }
            });
        }
        else{
            callback(null, false);
        }
    }
    catch(e){
        var errmsg = 'Fail to complete product activity: ' + e;
        logger.error(errmsg);
        callback(new Error(errmsg));
    }
});
};


Service[ProductActivityActions.publish] = function(thingId, uid, callback){
    ProductActivity.findOne({_id: thingId, initiator: uid}, "_id crtOn updBy updOn rank status", function (err, doc) {
    if(err){
        var errmsg = 'Fail to publish product activity: ' + err;
        logger.error(errmsg);
        callback(new Error(errmsg));
        return;
    }
    else if(!doc){
        var errmsg = 'Fail to publish product activity, activity does not exist or initiator is not correct';
        logger.error(errmsg);
        callback(new Error(errmsg));
        return;
    }
    var currentStatus = ProductActivityStatus.valueNames(doc.status);
    var wf = ProductActivityWorkflow.newInstance(currentStatus, doc);
    try{
        wf.actions().publish();
        wf.actions().approve();
        if(wf.changed() && wf.current()==ProductActivityStatus.Applying.name()){
            doc.status = ProductActivityStatus.names(wf.current());
            doc.save(function(err){
                if(err){
                    callback(err);
                }
                else{
                    callback(null, true);
                }
            });
        }
        else{
            callback(null, false);
        }
    }
    catch(e){
        var errmsg = 'Fail to publish product activity: ' + e;
        logger.error(errmsg);
        callback(new Error(errmsg));
    }
});
};

Service[ProductActivityActions.recall] = function(thingId, uid, callback){
    ProductActivity.findOne({_id: thingId, initiator: uid}, "_id crtOn updBy updOn rank status", function (err, doc) {
    if(err){
        var errmsg = 'Fail to recall product activity: ' + err;
        logger.error(errmsg);
        callback(new Error(errmsg));
        return;
    }
    else if(!doc){
        var errmsg = 'Fail to recall product activity, activity does not exist or initiator is not correct';
        logger.error(errmsg);
        callback(new Error(errmsg));
        return;
    }
    var currentStatus = ProductActivityStatus.valueNames(doc.status);
    var wf = ProductActivityWorkflow.newInstance(currentStatus, doc);
    try{
        wf.actions().recall();
        if(wf.changed() && wf.current()==ProductActivityStatus.Draft.name()){
            doc.status = ProductActivityStatus.names(wf.current());
            doc.save(function(err){
                if(err){
                    callback(err);
                }
                else{
                    callback(null, true);
                }
            });
        }
        else{
            callback(null, false);
        }
    }
    catch(e){
        var errmsg = 'Fail to recall product activity: ' + e;
        logger.error(errmsg);
        callback(new Error(errmsg));
    }
});
};

Service[ProductActivityActions.cancel] = function(thingId, uid, callback){
    ProductActivity.findOne({_id: thingId, initiator: uid}, "_id crtOn updBy updOn rank status applications", function (err, doc) {
    if(err){
        var errmsg = 'Fail to cancel product activity: ' + err;
        logger.error(errmsg);
        callback(new Error(errmsg));
        return;
    }
    else if(!doc){
        var errmsg = 'Fail to cancel product activity, activity does not exist or initiator is not correct';
        logger.error(errmsg);
        callback(new Error(errmsg));
        return;
    }
    var currentStatus = ProductActivityStatus.valueNames(doc.status);
    var wf = ProductActivityWorkflow.newInstance(currentStatus, doc);
    if(doc.applications && doc.applications.length>0){
        callback(null, false);
        return;
    }

    try{
        wf.actions().cancel();
        if(wf.changed() && wf.current()==ProductActivityStatus.Cancelled.name()){
            doc.status = ProductActivityStatus.names(wf.current());
            doc.save(function(err){
                if(err){
                    callback(err);
                }
                else{
                    callback(null, true);
                }
            });
        }
        else{
            callback(null, false);
        }
    }
    catch(e){
        var errmsg = 'Fail to cancel product activity: ' + e;
        logger.error(errmsg);
        callback(new Error(errmsg));
    }
});
};

Service.events.on('after-create', function(doc){
    //TODO replace it with real logic
    logger.debug('Product Activity ' + doc.name + ' is created.');
});
Service.events.on('after-comment', function(doc){
    //if(doc.comment.replyTo === ''){
    //    ProductActivity.populate(doc.doc, {path: "initiator"}, function(err, popdoc){
    //        if(err) return logger.debug('populate pa failed.');
    //        if(popdoc && popdoc.initiator.hasOwnProperty('wx_openid')){
    //            var newdoc = {
    //                comment: doc.comment,
    //                paname: popdoc.name,
    //                paid: popdoc._id,
    //                openid: popdoc.initiator.wx_openid,
    //                type: 'commentRemind'
    //            };
    //            return pushmessage(newdoc);
    //        }
    //    });
    //}else{
    //    Comment.populate(doc.comment, {path: "replyTo"}, function(err, popdoc){
    //        ProductActivity.populate(doc.doc, {path: "initiator"}, function(err, 
    //papopdoc){
        //            popdoc.replyTo.wx_openid = '123';
        //            if(err) return logger.debug('populate pa failed.');
        //            if(popdoc && popdoc.replyTo.wx_openid){
        //                var newdoc = {
        //                    comment: doc.comment,
        //                    paname: papopdoc.name,
        //                    paid: papopdoc._id,
        //                    openid: popdoc.replyTo.wx_openid,
        //                    type: 'replyRemind'
        //                };
        //                return pushmessage(newdoc);
        //            }else{
        //                return logger.debug('nothing to push.');
        //            }
        //        });
        //    })
        //}
    });

    Service.events.on('after-applicate', function(doc){
        //var newdoc = doc;
        //newdoc.type = 'applicantRemind';
        //pushmessage(newdoc);
    });

    function pushmessage(doc){
        pushMessageService.pushApplicationMessage(doc, function(err){
            if(!err){
                logger.info('Product Activity messages are pushed success.');
            }else{
                console.log(err);
            }
        })
    }
    module.exports = Service;
