var logger = require('../app/logging').logger;
var u = require('../app/util');
var time = require('../app/time');
var Tenant = require('../models/Tenant').model;
var User = require('../models/User').model;
var TenantMember = require('../models/TenantMember').model;

var Service = {};

Service.load = function (id, callback) {
    Tenant.findById(id)
        .populate('members.TenantMember')
        .lean(true).exec(function (err, doc) {
        if (err) {
            logger.error('Fail to load tenant [id=' + id + ']: ' + err);
            if (callback) callback(err);
            return;
        }

        logger.debug('Succeed to load tenant [id=' + id + ']');
        if (callback) callback(null, doc);
    });
};

Service.create = function (json, callback) {
    var tenant = new Tenant(json);

    tenant.save(function (err, doc, numberAffected) {
        if (err) {
            if (callback) callback(err);
            return;
        }
        if (numberAffected) {
            logger.debug('Succeed to create tenant: ' + require('util').inspect(doc) + '\r\n');
            if (callback) callback(null, doc);
        }
        else {
            logger.error('Fail to create tenant: ' + require('util').inspect(doc) + '\r\n');
            if (callback) callback(new Error('Fail to create tenant'));
        }
    });

};

Service.delete = function (id, callback) {
    Tenant.findByIdAndRemove(id, function (err, doc) {
        if (err) {
            logger.error('Fail to delete tenant [id=' + id + ']: ' + err);
            if (callback) callback(err);
            return;
        }

        logger.debug('Succeed to delete tenant [id=' + id + ']');
        if (callback) callback(null, doc);
    });
};

Service.update = function (id, update, callback) {
    Tenant.findById(id, function (err, doc) {
        if (err) {
            logger.error('Fail to update tenant [id=' + id + ']: ' + err);
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
                    logger.debug('Succeed to update tenant: ' + require('util').inspect(result) + '\r\n');
                    if (callback) callback(null, result);
                }
                else {
                    var errMsg = 'Fail to update tenant [id=' + id + '] with ' + require('util').inspect(update) + '\r\n';
                    logger.error(errMsg);
                    if (callback) callback(new Error(errMsg));
                }
            });
        }
        else {
            logger.debug('Fail to update tenant [id=' + id + '] because it does not exist');
            if (callback) callback(null, null);
        }

    });
};

Service.find = function (params, callback) {
    var query = Tenant.find();

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
    var query = Tenant.find();

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

Service.getIn = function(id, uid, callback){

    var update = {members:[]};

    var member = {
        displayName:''
        , headImgUrl:''
        , wx_openid: ''
    };


    User.findById(uid).exec(function(err, user){

        if (err){
            if (callback) callback(err);
            logger.info('sst find User err' + err);
            return;
        }

        for(var prop in member){
            logger.info('sst prop=' + prop);
            if (user[prop]!=null) {
                logger.info('user[prop]=' + user[prop]);
                member[prop] = user[prop];
            }
        }

        member.userId = uid;

        logger.debug('Success to find User  [uid=' + uid + ']');


        if (member.wx_openid!=''){

            Tenant.findById(id, function(err, tdoc) {

                    if (err) {
                        logger.error('Fail to load tenant [id=' + id + ']: ' + err);
                        if (callback) callback(err);
                        return;
                    }

                    logger.debug('Success to load tenant [id=' + id + ']');

                    var members = tdoc.members;
                    var len = members.length;
                    var found = false;

                    var i=0;

                    if (len==0){

                        //push new TenantMember to members
                        var tMember = new TenantMember(member);
                        var now = time.currentTime();
                        tMember.autoId();
                        tMember.autoCreatedOn(now);
                        tMember.autoUpdatedOn(now);
                        tdoc.update({
                                $push: {members: tMember},
                                $set: {updOn: now}

                            }, function(err, doc){
                                //todo, callback
                                logger.debug('first push err code=' + err);
                                if (callback) callback(err, tdoc);
                            });

                    }
                    else {

                        getIn();

                        function getIn() {
                            try{
                            if (members[i].wx_openid == member.wx_openid) {
                                found = true;

                                var tMember = new TenantMember(member);
                                var now = time.currentTime();
                                tMember.autoId();
                                tMember.autoCreatedOn(now);
                                tMember.autoUpdatedOn(now);
                                //member['_id'] = members[i]._id;
                                var deleteId = members[i]._id;
                                logger.debug('sst deleteId =' + members[i]._id);


                                tdoc.update(
                                    {
                                        $pull:{members:{'_id':deleteId}},
                                        $set: {updOn: now}
                                    }, function(err1, doc1){
                                        //todo, callback

                                        if (err1){
                                            logger.debug('match pull push err code=' + err1);
                                            if (callback) callback(err1, doc1);
                                        }
                                        else{
                                            tdoc.update({
                                                $push: {members: tMember},
                                                $set: {updOn: now}
                                            }, function(err2, doc2){
                                                logger.debug('match pull push err code=' + err2);
                                                if (callback) callback(err2, tdoc);
                                            });
                                        }



                                    });

                            }
                            else {
                                i++;
                                if (i == len) {
                                    if (!found) {
                                        //push new TenantMember to members
                                        var tMember = new TenantMember(member);
                                        var now = time.currentTime();
                                        tMember.autoId();
                                        tMember.autoCreatedOn(now);
                                        tMember.autoUpdatedOn(now);
                                        tdoc.update(
                                            {
                                                $push: {members: tMember},
                                                $set: {updOn: now}

                                            }, function(err, doc){
                                                //todo, callback
                                                logger.debug('non match push err code=' + err);
                                                if (callback) callback(err, tdoc);
                                            });
                                    }

                                }
                                else {
                                    getIn();
                                }
                            }
                            }
                            catch(e){
                                logger.error(e);
                            }
                        }

                    }





                });



        }
        else{
            //not a valid user
            logger.debug('member wx_openid==null');
            if (callback) callback(true);
            return;
        }


    });



}

Service.getOut = function(id, uid, callback){


}

Service.getUser = function(id, uid, callback){


}


module.exports = Service;
