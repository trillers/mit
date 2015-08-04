var logger = require('../../app/logging').logger;
module.exports = function(router){
    require('../../app/routes-cs')(router);

    router.get('/chat', function(req, res){
        res.render('customer-server');
    });
};