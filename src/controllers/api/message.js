var messageService = require('../../services/MessageService');
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
};