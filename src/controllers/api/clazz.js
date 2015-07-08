var clazzService = require('../../services/ClazzService');
var clazzTeacherService = require('../../services/ClazzTeacherService');
var util = require('util');
var logger = require('../../app/logging').logger;
var ApiReturn = require('../../framework/ApiReturn');

module.exports = function(router){
    require('../../app/routes-api')(router);

    //read
    router.get('/_:id', function(req, res){
        clazzService.loadById(req.params.id, function(err, doc){
            //TODO: error handling
            res.status(200).json(ApiReturn.i().ok(doc));
        });
    });

    //create
    router.post('/', function(req, res){
        var className = req.body.name;
        var user = req.session.user.id;
        var clazz = {
            name: className,
            teachers: [],
            students: [],
            qrChannel: 'sh4s'
        }

        clazzTeacherService.loadByUserIdAsync(user)
            .then(function(clazzTeacher){
                clazz.teachers.push(clazzTeacher._id);
                clazzService.create(clazz, function(err, doc){
                    //TODO: error handling
                    res.status(200).json(ApiReturn.i().ok(doc));
                });
            });
    });

    //update
    router.put('/_:id', function(req, res){
        var id = req.params.id;
        var update = req.body;
        clazzService.update(id, update, function(err, doc){
            //TODO: error handling
            res.status(200).json(ApiReturn.i().ok(doc));
        })
    });

    //delete
    router.delete('/_:id', function(req, res){
        var id = req.params.id;
        clazzService.delete(id, function(err, doc){
            //TODO: error handling
            res.status(200).json(ApiReturn.i().ok(doc));
        })
    });
};