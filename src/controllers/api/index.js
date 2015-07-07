
module.exports = function(app){
    var express = require('express');
    var subsystemRouter = null;
    var moduleRouter = null;
    //subsystem router
    subsystemRouter = express.Router({strict: true});
    app.use('/api', subsystemRouter);

    //wechat
    moduleRouter = express.Router({strict: true});
    require('./wechat')(moduleRouter);
    subsystemRouter.use('/wechat', moduleRouter);

    //user
    moduleRouter = express.Router({strict: true});
    require('./user')(moduleRouter);
    subsystemRouter.use('/user', moduleRouter);
;
};