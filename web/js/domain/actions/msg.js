var domain = require('../domain');
var apiFactory = domain.restApi();

domain.action('MsgInClazzLoadAction').onExecute(function(data){
    apiFactory.get('/msg/clazz_messages').drive(this).send(data);
});
domain.action('MsgInClazzAddAction').onExecute(function(data){
    apiFactory.post('/msg').drive(this).send(data);
});
domain.action('MsgReplyLoadAction').onExecute(function(data){
    apiFactory.get('/msg/reply').drive(this).send(data);
});
domain.action('MsgToUserLoadAction').onExecute(function(data){
    apiFactory.get('/msg/one_to_one').drive(this).send(data);
});
domain.action('MsgInitDataAction').onExecute(function(data){
    apiFactory.get('/msg/chatInitData').drive(this).send(data);
});
module.exports = null;