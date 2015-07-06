module.exports = function(app){
    require('./favicon')(app);
    require('./heartbeat')(app);
    require('./static')(app);
    app.use(require('../middlewares/session')());
    require('./auth')(app);

    require('../controllers')(app);
};