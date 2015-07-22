var teacherService = require('../../services/ClazzTeacherService');
var userService = require('../../services/UserService');
var UserRole = require('../../models/TypeRegistry').item('UserRole');
var util = require('util');
var logger = require('../../app/logging').logger;
var ApiReturn = require('../../framework/ApiReturn');
var UserKv = require('../../kvs/User');

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

    //updateByUserId
    router.put('/', function(req, res){
        var ct = req.body;
        var userId = req.session.user.id;
        ct.user = userId;
        var result;
        teacherService.updateByUserIdAsync(userId, ct)
            .then(function(doc){
                result = doc;
                return userService.updateAsync(userId, {roleBindOrNot: true});
            })
            .then(function(user){
                UserKv.loadByIdAsync(user._id)
                    .then(function(user){
                        user.roleBindOrNot = true;
                        return UserKv.saveByIdAsync(user);
                    })
                    .then(function(user){
                        UserKv.setFlagResignin(user.wx_openid, true);
                        res.status(200).json(ApiReturn.i().ok(result));
                    });
            });
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