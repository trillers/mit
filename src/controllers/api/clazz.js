var clazzService = require('../../services/ClazzService');
var clazzTeacherService = require('../../services/ClazzTeacherService');
var userBizService = require('../../services/UserBizService');
var clazzBriefService = require('../../services/ClazzBriefService');
var util = require('util');
var logger = require('../../app/logging').logger;
var ApiReturn = require('../../framework/ApiReturn');

module.exports = function(router){
    require('../../app/routes-api')(router);

    //read
    router.get('/_:id', function(req, res){
        clazzService.load(req.params.id, function(err, doc){
            //TODO: error handling
            res.status(200).json(ApiReturn.i().ok(doc));
        });
    });

    router.get('/students', function(req, res){
        clazzService.loadStudentsById(req.params.id, function(err, doc){
            res.status(200).json(ApiReturn.i().ok(doc));
        });
    });

    router.post('/student', function(req, res){
        console.log(req.body);

        //new user
        //new userbiz
        //new clazz student
        //update clazz
    })

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
        var result;
        clazzTeacherService.loadByUserIdAsync(user)
            .then(function(clazzTeacher){
                clazz.teachers.push(clazzTeacher._id);
                return clazzService.createAsync(clazz);
            })
            .then(function(clazz){
                result = clazz;
                var clazzBrief = {
                    clazz: clazz._id,
                    name: clazz.name
                }
                return clazzBriefService.createAsync(clazzBrief);
            })
            .then(function(clazzBrief){
                userBizService.addClazz(user, clazzBrief._id, function(err, doc){
                    //TODO: error handling
                    res.status(200).json(ApiReturn.i().ok(result));
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