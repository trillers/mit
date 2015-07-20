var domain = require('../domain');
var apiFactory = domain.restApi();

domain.action('MsgInClazzLoadAction').onExecute(function(data){
    apiFactory.get('/clazz/msg').drive(this).send(data);
});
domain.action('MsgInClazzAddAction').onExecute(function(data){
    apiFactory.post('/clazz/msg').drive(this).send(data);
});


module.exports = null;