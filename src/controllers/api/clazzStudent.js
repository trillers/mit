var studentService = require('../../services/ClazzStudentService');
var userService = require('../../services/UserService');
var UserRole = require('../../models/TypeRegistry').item('UserRole');
var util = require('util');
var logger = require('../../app/logging').logger;
var ApiReturn = require('../../framework/ApiReturn');
var UserRole = require('../../models/TypeRegistry').item('UserRole');

module.exports = function(router){
    require('../../app/routes-api')(router);

    //updateByUserId
    router.put('/', function(req, res){
        var cs = req.body;
        var userId = req.session.user.id;
        var result;
        studentService.updateByUserIdAsync(userId, cs)
            .then(function(doc){
                result = doc;
                return userService.updateAsync(userId, {roleBindOrNot: true});
        })
            .then(function(user){
                res.status(200).json(ApiReturn.i().ok(result));
            });
    });
};