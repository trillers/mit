var messageService = require('../../services/MessageService');
var clazzStudentService = require('../../services/ClazzStudentService');
var clazzTeacherService = require('../../services/ClazzTeacherService');
var UserRole = require('./TypeRegistry').item('UserRole');
var util = require('util');
var logger = require('../../app/logging').logger;
var ApiReturn = require('../../framework/ApiReturn');

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
            //TODO: error handling
            for(var i = 0, len = docs.length; i < len; i++){
                if(docs[i].from.role == UserRole.Teacher){
                    clazzTeacherService.loadByUserId(docs[i].from._id)
                        .then(function(clazzTeacher){
                            docs[i].from = clazzTeacher.name;
                        });
                }else if(docs[i].from.role == UserRole.Student){
                    clazzStudentService.loadByUserId(docs[i].from._id)
                        .then(function(clazzStudent){
                            docs[i].from = clazzStudent.name;
                        });
                }
                if(docs[i].to.role == UserRole.Teacher){
                    clazzTeacherService.loadByUserId(docs[i].to._id)
                        .then(function(clazzTeacher){
                            docs[i].to = clazzTeacher.name;
                        });
                }else if(docs[i].to.role == UserRole.Student){
                    clazzStudentService.loadByUserId(docs[i].toBase64()._id)
                        .then(function(clazzStudent){
                            docs[i].to = clazzStudent.name;
                        });
                }
            }
            res.status(200).json(ApiReturn.i().ok(docs));
        })
    })

    //loadUserMessage
    router.get('/myMessage', function(req, res){
        var userId = req.session.user.id;

    });
};