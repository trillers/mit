var logger = require('../../src/app/logging').logger;
var async = require("async");
var service = require('../../src/services/UserService');
var userMock = {
    displayName: '昵称'
};

exports.testCreateAndDeleteUser = function(test){
    var randomId = new Date().getTime();
    userMock.wx_openid = randomId;
    service.createFromWechat(userMock, function(err, doc){
        if(err){
            test.ok(false);
            test.done();
        }
        else{
            test.ok(true);
            service.delete(doc._id, function(err, result){
                if(err){
                    test.ok(false);
                }
                else{
                    if(result){
                        test.ok(true);
                    }
                    else{
                        test.ok(false);
                    }
                }
                test.done();
            });
        }
    });
};

exports.testLoadUser = function(test){
    var id = null;
    var user = null;
    async.series([
            function(cb){
                var randomId = new Date().getTime();
                userMock.wx_openid = randomId;
                service.createFromWechat(userMock, function(err, doc){
                    if(!err){
                        id = doc ? doc._id : null;
                        user = doc;
                    }
                    cb(err, doc);
                });
            }
        ],
        function(err, results){
            if(err){
                test.ok(false);
                test.done();
                return;
            }
            service.load(id, function(err, result){
                if(err){
                    test.ok(false);
                }
                else{
                    if(result){
                        test.equals(result._id, id);
                        test.equals(result.displayName, user.displayName);
                        test.ok(true);
                        service.delete(id); //clear up the temporarily created object
                    }
                    else{
                        test.ok(false);
                    }
                }
                test.done();
            });
        }
    );//end async
};


exports.testUpdateUser = function(test){
    var id = null;
    var user = null;
    async.series([
            function(cb){
                var randomId = new Date().getTime();
                userMock.wx_openid = randomId;
                service.createFromWechat(userMock, function(err, doc){
                    if(!err){
                        id = doc ? doc._id : null;
                        user = doc;
                    }
                    test.ok(!err);
                    cb(err, doc);
                });
            },
            function(cb){
                var userUpdate = {displayName: 'name updated'};
                service.update(id, userUpdate, function(err, result){
                    if(err){
                        test.ok(false);
                    }
                    else{
                        if(result){
                            test.equals(result._id, id);
                            test.equals(result.displayName, userUpdate.displayName);
                            test.ok(true);
                            logger.debug('Succeed to update travel target: ' + require('util').inspect(result) + '\r\n');
                        }
                        else{
                            test.ok(false);
                        }
                    }
                    cb(err, result);
                });

            }
            ,function(cb){
                service.delete(id, function(err, doc){
                    test.ok(!err);
                    cb(err, doc);
                });
            }
        ],
        function(err, results){
            console.error(err);
            test.ok(!err);
            test.done();
        }
    );//end async
};
