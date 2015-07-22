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
            _populateFromUserAsync(doc)
                .then(function(){
                    return _populateFromUserAsync(doc);
                })
                .then(function(){
                    console.log(doc)
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
                    return _populateFromUserAsync(doc);
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

    //clazz messages
    router.get('/clazz_messages', function(req, res){
        var channel = req.query.channel;
        var params = {
            conditions: {channel: channel},
            sort: {crtOn: -1}
        }
        messageService.filter(params, function(err, docs){
            var arr = [];
            for(var i = 0, len = docs.length; i < len; i++){
                arr.push(_populateFromUserAsync(docs[i]));
                arr.push(_populateToUserAsync(docs[i]));
            }
            Promise.all(arr).then(function () {
                res.status(200).json(ApiReturn.i().ok(docs));
            })
        })
    });
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
};