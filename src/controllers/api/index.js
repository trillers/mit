
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

    //clazzTeacher
    moduleRouter = express.Router({strict: true});
    require('./clazzTeacher')(moduleRouter);
    subsystemRouter.use('/teacher', moduleRouter);

    //clazzTeacher
    moduleRouter = express.Router({strict: true});
    require('./clazzStudent')(moduleRouter);
    subsystemRouter.use('/student', moduleRouter);

    //clazz
    moduleRouter = express.Router({strict: true});
    require('./clazz')(moduleRouter);
    subsystemRouter.use('/clazz', moduleRouter);

    //qr
    moduleRouter = express.Router({strict: true});
    require('./qr')(moduleRouter);
    subsystemRouter.use('/qr', moduleRouter);

    //message
    moduleRouter = express.Router({strict: true});
    require('./message')(moduleRouter);
    subsystemRouter.use('/msg', moduleRouter);
};