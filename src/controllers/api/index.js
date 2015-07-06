
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

    //image
    moduleRouter = express.Router({strict: true});
    require('./img')(moduleRouter);
    subsystemRouter.use('/img', moduleRouter);

    //travel target
    moduleRouter = express.Router({strict: true});
    require('./tt')(moduleRouter);
    subsystemRouter.use('/tt', moduleRouter);

    //product activity
    moduleRouter = express.Router({strict: true});
    require('./pa')(moduleRouter);
    subsystemRouter.use('/pa', moduleRouter);

    //tenant
    moduleRouter = express.Router({strict: true});
    require('./tenant')(moduleRouter);
    subsystemRouter.use('/tenant', moduleRouter);
};