var messageService = require('../../services/MessageService');
var clazzService = require('../../services/ClazzService');
var userBizService = require('../../services/UserBizService');
var clazzStudentService = require('../../services/ClazzStudentService');
var clazzTeacherService = require('../../services/ClazzTeacherService');
var clazzService = require('../../services/ClazzService');
var UserRole = require('../../models/TypeRegistry').item('UserRole');
var util = require('util');
var logger = require('../../app/logging').logger;
var ApiReturn = require('../../framework/ApiReturn');
var EventEmitter = require('events').EventEmitter;
var Promise = require('bluebird');
var myutil = require('../../app/util');

module.exports = function(router){
    require('../../app/routes-api')(router);

    //read
    router.get('/_:id', function(req, res){
        messageService.load(req.params.id, function(err, doc){
            //TODO: error handling
            res.status(200).json(ApiReturn.i().ok(doc));
        });
    });

    //create
    router.post('/', function(req, res){
        var msg = req.body;
        msg.from = req.session.user.id;
        messageService.create(msg, function(err, doc){
            _populateFromUserAsync(doc)
                .then(function(doc){
                    return _populateToUserAsync(doc);
                })
                .then(function(doc){
                    return res.status(200).json(ApiReturn.i().ok(doc));
                })
        })
    });

    //update
    router.put('/_:id', function(req, res){
        var id = req.params.id;
        var update = req.body;
        messageService.update(id, update, function(err, doc){
            //TODO: error handling
            _populateFromUserAsync(doc)
                .then(function(){
                    return _populateToUserAsync(doc);
                })
                .then(function(){
                    return res.status(200).json(ApiReturn.i().ok(doc));
                })
        })
    });

    //delete
    router.delete('/_:id', function(req, res){
        var id = req.params.id;
        messageService.delete(id, function(err, doc){
            //TODO: error handling
            res.status(200).json(ApiReturn.i().ok(doc));
        })
    });

    router.get('/one_to_one', function(req, res){
        var channel = req.query.channel;
        var params = {
            conditions: {channel: channel},
            sort: {crtOn: -1}
        }
        msgFilterAsync(params)
            .then(function(msgs){
                return res.status(200).json(ApiReturn.i().ok(msgs));
            });
    });

    router.get('/reply', function(req, res){
        var channel = req.query.channel;
        var user = req.session.user;
        var params = {
            conditions: {channel: channel},
            sort: {crtOn: -1}
        }
        user.role == UserRole.Student.value()  ? params.conditions['$or'] = [{from: user.id}, {to: user.id}] : '';
        msgFilterAsync(params)
            .then(function(msgs){
                return res.status(200).json(ApiReturn.i().ok(msgs));
            });
    });

    //clazz messages
    router.get('/clazz_messages', function(req, res){
        var clazzId = req.query.channel;
        var params = {
            conditions: {channel: clazzId},
            sort: {crtOn: -1}
        }
        msgFilterAsync(params)
            .then(function(msgs){
                res.status(200).json(ApiReturn.i().ok(msgs));
            });
    });

    var msgFilterAsync = Promise.promisify(msgFilter);
    function msgFilter(params, cb){
        messageService.filter(params, function(err, docs){
            var arr = [];
            for(var i = 0, len = docs.length; i < len; i++){
                arr.push(_populateFromUserAsync(docs[i]));
                arr.push(_populateToUserAsync(docs[i]));
            }
            Promise.all(arr).then(function () {
                cb(null, docs);
            })
        })
    }

    var _populateFromUserAsync = Promise.promisify(_populateFromUser);
    var _populateToUserAsync = Promise.promisify(_populateToUser);
    function _populateFromUser(doc, cb){
        if(doc.from.role == UserRole.Teacher.value()){
            clazzTeacherService.loadByUserIdAsync(doc.from._id)
                .then(function(clazzTeacher){
                    doc.from = clazzTeacher;
                    return cb(null, doc);
                });
        }else if(doc.from.role == UserRole.Student.value()){
            clazzStudentService.loadByUserIdAsync(doc.from._id)
                .then(function(clazzStudent){
                    doc.from = clazzStudent;
                    return cb(null, doc);
                });
        }else{
            return cb(null, doc)
        }
    }
    function _populateToUser(doc, cb){
        if(doc.to && doc.to.role == UserRole.Teacher.value()){
            clazzTeacherService.loadByUserIdAsync(doc.to._id)
                .then(function(clazzTeacher){
                    doc.to = clazzTeacher;
                    return cb(null, doc);
                });
        }else if(doc.to && doc.to.role == UserRole.Student.value()){
            clazzStudentService.loadByUserIdAsync(doc.to._id)
                .then(function(clazzStudent){
                    doc.to = clazzStudent;
                    return cb(null, doc);
                });
        }else{
            return cb(null, doc)
        }
    }
    //loadUserMessage
    router.get('/myMessage', function(req, res){
        var userId = req.session.user.id;

    });

    //send single msg
    router.post('/single_msg', function(req, res){
        var msg = req.body;
        var userId = req.session.user.id;
        msg.from = userId;
        msg.channel = myutil.genOneToOneId(userId, msg.to);
        saveMessage(msg, function(err, doc){
            //TODO error handler
            return res.status(200).json(ApiReturn.i().ok(doc));
        })
    });

    //send mass msg
    router.post('/mass_msg', function(req, res){
        var msg = req.body;
        var userId = req.session.user.id;
        msg.from = userId;
        var result;
        saveMessageAsync(msg)
            .then(function(doc){
                result = doc;
                return  clazzService.loadStudentsByIdAsync(msg.channel);
            })
            .then(function(students){
                var arr = [];
                for(var i = 0, len = students.length; i < len; i++){
                    var newMsg = msg;
                    newMsg.channel = myutil.genOneToOneId(students[i].user, userId);
                    arr.push(saveMessageAsync(newMsg));
                }
                Promise.all(arr).then(function () {
                    res.status(200).json(ApiReturn.i().ok(result));
                })
            })
            .catch(Error, function(err) {
                logger.error('send mass message error: ' + err);
                res.status(500).json(ApiReturn.i().error(500, 'failed to send mass msg'));
            })
    });
    //save message
    function saveMessage(msg, cb){
        messageService.create(msg, function(err, doc){
            if(err){
                return cb(err);
            }
            _populateFromUserAsync(doc)
                .then(function(doc){
                    return _populateToUserAsync(doc);
                })
                .then(function(doc){
                    return cb(null, doc);
                })
        })
    }
    var saveMessageAsync = Promise.promisify(saveMessage);

    //initial student chat page data
    router.get('/studentChatInitData', function(req, res){
        var clazzId = req.query.clazzId;
        var userId = req.session.user.id;
        var result = {};
        clazzService.loadTeachersByIdAsync(clazzId)
            .then(function(teachers){
                result.teacher = teachers[0];
                var params = {
                    conditions: {channel: myutil.genOneToOneId(userId, result.teacher.user)},
                    sort: {crtOn: -1}
                }
                return msgFilterAsync(params)
            })
            .then(function(msgs){
                result.msgs = msgs;
                res.status(200).json(ApiReturn.i().ok(result));
            })
    });

    //initial teacher chat page data
    router.get('/teacherChatInitData', function(req, res){
        var clazzId = req.query.clazzId;
        var userId = req.session.user.id;
        var receiverId = req.query.userId;
        var result = {}, clazzData;

        clazzService.loadAsync(clazzId)
            .then(function(clazz){
                clazzData = clazz;
                return userBizService.loadUserClazzAsync(userId);
            })
            .then(function(userBiz){
                var clazzes = userBiz.clazzes;
                for(var i = 0, len = clazzes.length; i < len; i++){
                    if(clazzes[i].clazz == clazzData._id){
                        clazzes[i].students = clazzData.students;
                        break;
                    }
                }
                result.clazzes = clazzes;
                var params = {
                    conditions: {channel: myutil.genOneToOneId(userId, receiverId)},
                    sort: {crtOn: -1}
                }
                return msgFilterAsync(params);
            })
            .then(function(msgs){
                result.msgs = msgs;
                res.status(200).json(ApiReturn.i().ok(result));
            })
    });
    //load message record
    router.get('/historyMsg', function(req, res){
        var receiverId = req.query.userId;
        var userId = req.session.user.id;
        var params = {
            conditions: {channel: myutil.genOneToOneId(userId, receiverId)},
            sort: {crtOn: -1}
        }
        msgFilterAsync(params)
            .then(function(msgs){
                res.status(200).json(ApiReturn.i().ok(msgs));
            })
    });
};