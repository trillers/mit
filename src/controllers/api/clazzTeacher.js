var teacherService = require('../../services/ClazzTeacherService');
var util = require('util');
var logger = require('../../app/logging').logger;
var ApiReturn = require('../../framework/ApiReturn');

module.exports = function(router){
    require('../../app/routes-api')(router);

    //read
    router.get('/_:id', function(req, res){
        teacherService.loadById(req.params.id, function(err, doc){
            //TODO: error handling
            res.status(200).json(ApiReturn.i().ok(doc));
        })
    });

    //create
    router.post('/', function(req, res){
        var ct = req.body;
        ct.user = req.session.user.id;
        teacherService.create(ct, function(err, doc){
            //TODO: error handling
            res.status(200).json(ApiReturn.i().ok(doc));
        });
    });

    //update
    router.put('/_:id', function(req, res){
        var id = req.params.id;
        var update = req.body;
        teacherService.update(id, update, function(err, doc){
            //TODO: error handling
            res.status(200).json(ApiReturn.i().ok(doc));
        })
    });

    //delete
    router.delete('/_:id', function(req, res){
        var id = req.params.id;
        teacherService.delete(id, function(err, doc){
            //TODO: error handling
            res.status(200).json(ApiReturn.i().ok(doc));
        })
    });
};