var express = require('express');

module.exports = function(app){
    var router = null;

    app.get('/debug', function(req, res, next){
        res.render('debug', {});
    });

    app.use('/wechat', require('./wechat')());

    router = express.Router({strict: false});
    require('./spa')(router);
    app.use('/', router);

    //spa for all modules
    router = express.Router({strict: false});
    require('./spa')(router);
    app.use('/index', router);

    //travel target
    router = express.Router({strict: true});
    require('./tt')(router);
    app.use('/tt', router);

    //activity
    router = express.Router({strict: true});
    require('./pa')(router);
    app.use('/pa', router);


    //mc
    router = express.Router({strict: true});
    require('./mc')(router);
    app.use('/mc', router);

    app.use('/test', function(req, res, next){
        res.render('./testlocalid');
    });
};