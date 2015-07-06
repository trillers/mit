var service = require('../../services/TravelTargetService');
var util = require('util');
var logger = require('../../app/logging').logger;
var ApiReturn = require('../../framework/ApiReturn');

module.exports = function(router){
    require('../../app/routes-api')(router);
    var afilter = require('../../middlewares/auth-filter-anonymously');
    router.use(afilter);


    //create
    router.post('/', function(req, res){
        var tt = req.body;
        service.create(tt, function(err, doc){
            //TODO: error handling
            res.status(200).json(ApiReturn.i().ok(doc));
        })
    });

    //read
    router.get('/_:id', function(req, res){
        service.load(req.params.id, function(err, doc){
            res.format({
                json: function(){
                    res.status(200).json(ApiReturn.i().ok(doc));
                },
                html: function(){
                    res.render('travel-target', doc);
                }
            });
        })
    });

    //update
    router.put('/_:id', function(req, res){
        var id = req.params.id;
        var update = req.body;
        service.update(id, update, function(err, doc){
            //TODO: error handling
            res.status(200).json(ApiReturn.i().ok(doc));
        })
    });

    //delete
    router.delete('/_:id', function(req, res){
        var id = req.params.id;
        service.delete(id, function(err, doc){
            //TODO: error handling
            res.status(200).json(ApiReturn.i().ok(doc));
        })
    });

    //filter
    router.post('/filter', function(req, res){
        var params = {};
        try{
            params = JSON.parse(JSON.stringify(req.body.filter));
        }
        catch(e){
            logger.error(e);
            throw e; //TODO
        }
        service.filter(params, function(err, docs){
            //TODO: error handling
            res.status(200).json(ApiReturn.i().ok(docs));
        })
    });

    //like
    router.get('/_:id/like', function(req, res) {
        var thingId = req.params.id;
        var uid = req.query.uid || req.session.user.id;

        logger.debug(util.format('User %s like %s', uid, thingId));
        service.like(uid, thingId, function(err, doc) {
            //TODO: error handling
            res.status(200).json(ApiReturn.i().ok(doc));
        });
    });

    //add comment
    router.post('/_:id/comment', function(req, res) {
        var thingId = req.params.id;
        var comment = req.body;

        service.addComment(thingId, comment, function(err, doc) {
            //TODO: error handling
            res.status(200).json(ApiReturn.i().ok(doc));
        });
    });

    //list comments
    router.get('/_:id/comments', function(req, res) {
        var thingId = req.params.id;
        service.listComments(thingId, function(err, docs) {
            //TODO: error handling
            res.status(200).json(ApiReturn.i().ok(docs));
        });
    });

};