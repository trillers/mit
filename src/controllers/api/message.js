var messageService = require('../../services/MessageService');
var clazzStudentService = require('../../services/ClazzStudentService');
var clazzTeacherService = require('../../services/ClazzTeacherService');
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
            //TODO: error handling
            res.status(200).json(ApiReturn.i().ok(doc));
        })
    });

    //update
    router.put('/_:id', function(req, res){
        var id = req.params.id;
        var update = req.body;
        messageService.update(id, update, function(err, doc){
            //TODO: error handling
            res.status(200).json(ApiReturn.i().ok(doc));
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

    //clazz messages
    router.get('/clazz_messages', function(req, res){
        var channel = req.query.channel;
        var params = {
            conditions: {channel: channel},
            sort: {crtOn: -1}
        }
        messageService.filter(params, function(err, docs){
            var eventNotify = {i : 0};
            myutil.extend(eventNotify, new EventEmitter());
            eventNotify.on('complete', function(len, docs){
                if(++i == len){
                    res.status(200).json(ApiReturn.i().ok(docs));
                }
            });
            //TODO: error handling
            for(var i = 0, len = docs.length; i < len; i++){
                (function(i) {
                    var arr = [];
                    arr.push(_func1Async(docs[i]));
                    arr.push(_func2Async(docs[i]));
                    Promise.all(arr).then(function () {
                        eventNotify.emit('complete', {len: len, docs: docs});
                    })
                })(i)
            }

        })
    });
    var _func1Async = Promise.promisify(_func1);
    var _func2Async = Promise.promisify(_func2);
    function _func1(doc, cb){
        if(doc.from.role == UserRole.Teacher){
            clazzTeacherService.loadByUserId(doc.from._id)
                .then(function(clazzTeacher){
                    doc.from = clazzTeacher.name;
                    return cb(doc);
                });
        }else if(doc.from.role == UserRole.Student){
            clazzStudentService.loadByUserId(doc.from._id)
                .then(function(clazzStudent){
                    doc.from = clazzStudent.name;
                    return cb(doc);
                });
        }
    }
    function _func2(doc, cb){
        if(doc.to && doc.to.role == UserRole.Teacher){
            clazzTeacherService.loadByUserId(doc.to._id)
                .then(function(clazzTeacher){
                    doc.to = clazzTeacher.name;
                    return cb(doc);
                });
        }else if(doc.to && doc.to.role == UserRole.Student){
            clazzStudentService.loadByUserId(doc.to._id)
                .then(function(clazzStudent){
                    doc.to = clazzStudent.name;
                    return cb(doc);
                });
        }
    }
    //loadUserMessage
    router.get('/myMessage', function(req, res){
        var userId = req.session.user.id;

    });
};