var logger = require('../../app/logging').logger;
var service = require('../../services/TravelTargetService');
var afilter = require('../../middlewares/auth-filter-anonymously');
var bfilter = require('../../middlewares/auth-filter-formally');
var hawaiisettings = require('mit-settings');
var https = require('https');
var url = require('url');
var util = require('util');
var querystring = require('querystring');
var sha1 = require('crypto').createHash('sha1');
var signature = "";
module.exports = function(router){
    require('../../app/routes-page')(router);

    router.get('/test', afilter, bfilter, function(req, res){
        res.render('tt/test');
    });

    router.get('/collection-:filter', afilter, function(req, res){
        var filter = req.params.filter; //TODO
        var user = req.user || {};
        service.filter({conditions: {}}, function(err, docs){
            docs = docs || {};
            res.render('tt/collection-default', {list: docs,likes:user});
        });
    });

    router.get('/:id', afilter, function(req, res){
        var id = req.params.id;
        logger.info('get travel target [id: ' + id + ']');
        service.load(id, function(err, tt){
            tt = tt || {}
            res.render('tt/travel-target', tt);
        });
    });


};