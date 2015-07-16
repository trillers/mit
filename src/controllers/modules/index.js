var express = require('express');

module.exports = function(app){
    var router = null;

    app.get('/debug', function(req, res, next){
        res.render('debug', {});
    });

    app.use('/wechat', require('./wechat')());

    app.use('/test', require('./test')());

    router = express.Router({strict: false});
    require('./spa')(router);
    app.use('/', router);

};