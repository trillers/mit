var logger = require('../../src/app/logging').logger;
var async = require("async");
var TravelTargetService = require('../../src/services/TravelTargetService');
var UserService = require('../../src/services/UserService');
var ttMock = require('./mocks/TravelTarget');

exports.testCreateAndDeleteTravelTarget = function(test){
    TravelTargetService.create(ttMock, function(err, doc){
        if(err){
            test.ok(false);
            test.done();
        }
        else{
            test.ok(true);
            TravelTargetService.delete(doc._id, function(err, result){
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

exports.testLoadTravelTarget = function(test){
    var id = null;
    var tt = null;
    async.series([
            function(cb){
                TravelTargetService.create(ttMock, function(err, doc){
                    if(!err){
                        id = doc ? doc._id : null;
                        tt = doc;
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
            TravelTargetService.load(id, function(err, result){
                if(err){
                    test.ok(false);
                }
                else{
                    if(result){
                        test.equals(result._id, id);
                        test.equals(result.name, tt.name);
                        test.ok(true);
                        TravelTargetService.delete(id); //clear up the temporarily created object
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

exports.testUpdateTravelTarget = function(test){
    var id = null;
    var tt = null;
    async.series([
            function(cb){
                TravelTargetService.create(ttMock, function(err, doc){
                    if(!err){
                        id = doc ? doc._id : null;
                        tt = doc;
                    }
                    test.ok(!err);
                    cb(err, doc);
                });
            },
            function(cb){
                var ttUpdate = {name: '杭州', summary: 'no summary'};
                TravelTargetService.update(id, ttUpdate, function(err, result){
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
                TravelTargetService.delete(id, function(err, doc){
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

exports.testFilterTravelTargets = function(test){
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
    TravelTargetService.filter(params, function(err, docs){
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


exports.testLikeTravelTarget = function(test){
    var id = null;
    var tt = null;
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
                TravelTargetService.create(ttMock, function(err, doc){
                    if(!err){
                        id = doc ? doc._id : null;
                        tt = doc;
                    }
                    test.ok(!err);
                    cb(err, doc);
                });
            },
            function(cb){
                TravelTargetService.like(user.id, id, function(err, result){
                    if(err){
                        test.ok(false);
                    }
                    else{
                        console.info('tt '+id+' likes: ' + result);
                        test.ok(true);
                    }
                    cb(err, result);
                });

            }
            ,function(cb){
                TravelTargetService.delete(id, function(err, doc){});
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
    var tt = null;
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
                TravelTargetService.create(ttMock, function(err, doc){
                    if(!err){
                        id = doc ? doc._id : null;
                        tt = doc;
                    }
                    test.ok(!err);
                    cb(err, doc);
                });
            },
            function(cb){
                TravelTargetService.load(id, function(err, doc){
                    console.error(doc);
                    test.ok(!err);
                    cb(err, doc);
                });
            },
            function(cb){
                var cmt = {comment: 'new comment'};
                cmt.crtBy = user.id;
                TravelTargetService.addComment(id, cmt, function(err, result){
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
                TravelTargetService.delete(id, function(err, doc){});
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
    var tt = null;
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
                TravelTargetService.create(ttMock, function(err, doc){
                    if(!err){
                        id = doc ? doc._id : null;
                        tt = doc;
                    }
                    test.ok(!err);
                    cb(err, doc);
                });
            },
            function(cb){
                TravelTargetService.addComment(id, {comment: 'comment a', crtBy: user.id}, function(err, doc){
                    cb(null, {});
                });
            },
            function(cb){
                TravelTargetService.addComment(id, {comment: 'comment b', crtBy: user.id}, function(err, doc){
                    cb(null, {});
                });
            },
            function(cb){
                TravelTargetService.addComment(id, {comment: 'comment c', crtBy: user.id}, function(err, doc){
                    cb(null, {});
                });
            },
            function(cb){
                TravelTargetService.listComments(id, function(err, docs){
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
                //TravelTargetService.delete(id, function(err, doc){});
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