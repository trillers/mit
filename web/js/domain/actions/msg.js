var domain = require('../domain');
var apiFactory = domain.restApi();

domain.action('MsgInClazzLoadAction').onExecute(function(data){
    apiFactory.get('/msg').drive(this).send(data);
});
domain.action('MsgInClazzAddAction').onExecute(function(data){
    apiFactory.post('/msg').drive(this).send(data);
});


module.exports = null;