var studentService = require('../../services/ClazzStudentService');
var util = require('util');
var logger = require('../../app/logging').logger;
var ApiReturn = require('../../framework/ApiReturn');

module.exports = function(router){
    require('../../app/routes-api')(router);

    //updateByUserId
    router.put('/', function(req, res){
        var cs = req.body;
        var userId = req.session.user.id;
        studentService.updateByUserId(userId, cs, function(err, doc){
            //TODO: error handling
            res.status(200).json(ApiReturn.i().ok(doc));
        });
    });
};