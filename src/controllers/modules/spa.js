var logger = require('../../app/logging').logger;
module.exports = function(router){
    require('../../app/routes-spa')(router);

    router.get('/', function(req, res){
        res.render('index');
    });
};