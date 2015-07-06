var logger = require('../../src/app/logging').logger;
var async = require("async");
var ProductActivityService = require('../../src/services/ProductActivityService');
var UserService = require('../../src/services/UserService');
var mockObj = require('./mocks/ProductActivity');
mockObj.startTime = new Date();
mockObj.endTime = new Date();
mockObj.closingTime = new Date();

exports.testCreateAndDeleteProductActivity = function(test){
    ProductActivityService.create(mockObj, function(err, doc){
        if(err){
            test.ok(false);
            test.done();
        }
        else{
            test.ok(true);
            ProductActivityService.delete(doc._id, function(err, result){
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

exports.testLoadProductActivity = function(test){
    var id = null;
    var activity = null;
    async.series([
            function(cb){
                ProductActivityService.create(mockObj, function(err, doc){
                    if(!err){
                        id = doc ? doc._id : null;
                        activity = doc;
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
            ProductActivityService.load(id, function(err, result){
                if(err){
                    test.ok(false);
                }
                else{
                    if(result){
                        test.equals(result._id, id);
                        test.equals(result.name, activity.name);
                        test.ok(true);
                        ProductActivityService.delete(id); //clear up the temporarily created object
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

exports.testUpdateProductActivity = function(test){
    var id = null;
    var activity = null;
    async.series([
            function(cb){
                ProductActivityService.create(mockObj, function(err, doc){
                    if(!err){
                        id = doc ? doc._id : null;
                        activity = doc;
                    }
                    test.ok(!err);
                    cb(err, doc);
                });
            },
            function(cb){
                var ttUpdate = {name: '杭州', summary: 'no summary'};
                ProductActivityService.update(id, ttUpdate, function(err, result){
                    if(err){
                        test.ok(false);
                    }
                    else{
                        if(result){
                            test.equals(result._id, id);
                            test.equals(result.name, ttUpdate.name);
                            test.equals(result.summary, ttUpdate.summary);
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
                ProductActivityService.delete(id, function(err, doc){
                    test.ok(!err);
                    cb(err, doc);
                });
            }
        ],
        function(err, results){
            test.ok(!err);
            test.done();
        }
    );//end async
};

exports.testFilterProductActivities = function(test){
    var params = {
        sort: {'updOn': -1},
        page: {
            size: 10,
            no: 1
        },
        conditions: {
            name: '苏州'
        }
    };
    ProductActivityService.filter(params, function(err, docs){
        if(err){
            logger.error('Fail to filter travel targets with params ' + JSON.stringify(params) +': ' +err);
            test.ok(false);
        }
        else{
            logger.debug('Succeed to filter travel targets with params ' + JSON.stringify(params));
            logger.debug('\r\n' + require('util').inspect(docs, {}) + '\r\n');
            test.ok(true);
        }
        test.done();
    });
};


exports.testLikeProductActivity = function(test){
    var id = null;
    var activity = null;
    var user = null;
    async.series([
            function(cb){
                UserService.createAnonymously(function(err, doc){
                    if(!err){
                        user = doc;
                    }
                    test.ok(!err);
                    cb(err, doc);
                });
            },
            function(cb){
                ProductActivityService.create(mockObj, function(err, doc){
                    if(!err){
                        id = doc ? doc._id : null;
                        activity = doc;
                    }
                    test.ok(!err);
                    cb(err, doc);
                });
            },
            function(cb){
                ProductActivityService.like(user.id, id, function(err, result){
                    if(err){
                        test.ok(false);
                    }
                    else{
                        console.info('activity '+id+' likes: ' + result);
                        test.ok(true);
                    }
                    cb(err, result);
                });

            }
            ,function(cb){
                ProductActivityService.delete(id, function(err, doc){});
                UserService.delete(user.id, function(err, doc){});
                cb(null, {});
            }
        ],
        function(err, results){
            test.ok(!err);
            test.done();
        }
    );//end async
};


exports.testAddApplication = function(test){
    var id = null;
    var activity = null;
    var user = null;
    async.series([
            function(cb){
                UserService.createAnonymously(function(err, doc){
                    if(!err){
                        user = doc;
                    }
                    test.ok(!err);
                    cb(err, doc);
                });
            },
            function(cb){
                ProductActivityService.create(mockObj, function(err, doc){
                    if(!err){
                        id = doc ? doc._id : null;
                        activity = doc;
                    }
                    test.ok(!err);
                    cb(err, doc);
                });
            },
            function(cb){
                ProductActivityService.load(id, function(err, doc){
                    console.error(doc);
                    test.ok(!err);
                    cb(err, doc);
                });
            },
            function(cb){
                var application = {displayName: '张三', phone: '13812345678', num: 2, desc: '有一个小孩'};
                application.updBy = user.id;
                application.applicant = user.id;
                ProductActivityService.addApplication(id, application, function(err, result){
                    if(err){
                        test.ok(false);
                    }
                    else{
                        if(result){
                            test.ok(result._id);
                            test.equals(result.displayName, application.displayName);
                            test.ok(true);
                        }
                        else{
                            test.ok(false);
                        }
                    }
                    cb(err, result);
                });

            }
            ,function(cb){
                ProductActivityService.delete(id, function(err, doc){});
                UserService.delete(user.id, function(err, doc){});
                cb(null, {});
            }
        ],
        function(err, results){
            test.ok(!err);
            test.done();
        }
    );//end async
};

exports.testListApplications = function(test){
    var id = null;
    var activity = null;
    var user = null;
    async.series([
            function(cb){
                UserService.createAnonymously(function(err, doc){
                    if(!err){
                        user = doc;
                    }
                    test.ok(!err);
                    cb(err, doc);
                });
            },
            function(cb){
                ProductActivityService.create(mockObj, function(err, doc){
                    if(!err){
                        id = doc ? doc._id : null;
                        activity = doc;
                    }
                    test.ok(!err);
                    cb(err, doc);
                });
            },
            function(cb){
                setTimeout(function(){
                var application = {displayName: '张三', phone: '13812345678', num: 2, desc: '有一个小孩'};
                application.updBy = user.id;
                application.applicant = user.id;
                ProductActivityService.addApplication(id, application, function(err, doc){
                    cb(null, {});
                });
                }, 300);
            },
            function(cb){
                setTimeout(function(){
                var application = {displayName: '李四', phone: '13812345678', num: 2, desc: '有一个小孩'};
                application.updBy = user.id;
                application.applicant = user.id;
                ProductActivityService.addApplication(id, application, function(err, doc){
                    cb(null, {});
                });
                }, 300);
            },
            function(cb){
                setTimeout(function(){
                var application = {displayName: '王五', phone: '13812345678', num: 2, desc: '有一个小孩'};
                application.updBy = user.id;
                application.applicant = user.id;
                ProductActivityService.addApplication(id, application, function(err, doc){
                    cb(null, {});
                });
                }, 300);
            },
            function(cb){
                ProductActivityService.listApplications(id, function(err, docs){
                    if(err){
                        test.ok(false);
                    }
                    else{
                        test.ok(docs.length==3);
                        docs.forEach(function(item, index, list){
                            console.info(item);
                        });
                        test.ok(true);
                    }
                    cb(err, docs);
                });
            }
            ,function(cb){
                ProductActivityService.delete(id, function(err, doc){});
                UserService.delete(user.id, function(err, doc){});
                cb(null, {});
            }
        ],
        function(err, results){
            test.ok(!err);
            test.done();
        }
    );//end async
};

exports.testAddComment = function(test){
    var id = null;
    var activity = null;
    var user = null;
    async.series([
            function(cb){
                UserService.createAnonymously(function(err, doc){
                    if(!err){
                        user = doc;
                    }
                    test.ok(!err);
                    cb(err, doc);
                });
            },
            function(cb){
                ProductActivityService.create(mockObj, function(err, doc){
                    if(!err){
                        id = doc ? doc._id : null;
                        activity = doc;
                    }
                    test.ok(!err);
                    cb(err, doc);
                });
            },
            function(cb){
                ProductActivityService.load(id, function(err, doc){
                    console.error(doc);
                    test.ok(!err);
                    cb(err, doc);
                });
            },
            function(cb){
                var cmt = {comment: 'new comment'};
                cmt.crtBy = user.id;
                ProductActivityService.addComment(id, cmt, function(err, result){
                    if(err){
                        test.ok(false);
                    }
                    else{
                        if(result){
                            test.ok(result._id);
                            test.equals(result.comment, cmt.comment);
                            test.ok(true);
                        }
                        else{
                            test.ok(false);
                        }
                    }
                    cb(err, result);
                });

            }
            ,function(cb){
                ProductActivityService.delete(id, function(err, doc){});
                UserService.delete(user.id, function(err, doc){});
                cb(null, {});
            }
        ],
        function(err, results){
            test.ok(!err);
            test.done();
        }
    );//end async
};

exports.testListComments = function(test){
    var id = null;
    var activity = null;
    var user = null;
    async.series([
            function(cb){
                UserService.createAnonymously(function(err, doc){
                    if(!err){
                        user = doc;
                    }
                    test.ok(!err);
                    cb(err, doc);
                });
            },
            function(cb){
                ProductActivityService.create(mockObj, function(err, doc){
                    if(!err){
                        id = doc ? doc._id : null;
                        activity = doc;
                    }
                    test.ok(!err);
                    cb(err, doc);
                });
            },
            function(cb){
                ProductActivityService.addComment(id, {comment: 'comment a', commenter: user.id, crtBy: user.id}, function(err, doc){
                    cb(null, {});
                });
            },
            function(cb){
                setTimeout(function(){
                ProductActivityService.addComment(id, {comment: 'comment b', commenter: user.id, crtBy: user.id}, function(err, doc){
                    cb(null, {});
                });
                }, 300);
            },
            function(cb){
                setTimeout(function(){
                ProductActivityService.addComment(id, {comment: 'comment c', commenter: user.id, crtBy: user.id}, function(err, doc){
                    cb(null, {});
                });
                }, 300);
            },
            function(cb){
                ProductActivityService.listComments(id, function(err, docs){
                    if(err){
                        test.ok(false);
                    }
                    else{
                        //test.ok(docs.length==4);
                        docs.forEach(function(item, index, list){
                            console.info(item);
                        });
                        test.ok(true);
                    }
                    cb(err, docs);
                });
            }
            ,function(cb){
                //ProductActivityService.delete(id, function(err, doc){});
                //UserService.delete(user.id, function(err, doc){});
                cb(null, {});
            }
        ],
        function(err, results){
            test.ok(!err);
            test.done();
        }
    );//end async
};