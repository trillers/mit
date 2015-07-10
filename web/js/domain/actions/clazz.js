var domain = require('../domain');
var apiFactory = domain.restApi();

domain.action('ClazzAddAction').onExecute(function(data){
    apiFactory.post('/clazz').drive(this).send(data);
});

domain.action('ClazzFetchByTeacherAction').onExecute(function(data){
    apiFactory.get('/user/myClazz').drive(this).send(data);
});

domain.action('ClazzLoadStudentsAction').onExecute(function(data){
    apiFactory.get('/clazz/students').drive(this).send(data);
});

module.exports = null;