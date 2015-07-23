var domain = require('../domain');
var apiFactory = domain.restApi();

domain.action('ClazzAddAction').onExecute(function(data){
    apiFactory.post('/clazz').drive(this).send(data);
});

domain.action('ClazzFetchByStudentAction').onExecute(function(data){
    apiFactory.get('/user/myClazz').drive(this).send(data);
});

domain.action('ClazzFetchByTeacherAction').onExecute(function(data){
    apiFactory.get('/user/myClazz').drive(this).send(data);
});

domain.action('ClazzLoadAction').onExecute(function(data){
    apiFactory.get('/clazz/_' + data).drive(this).send();
});

domain.action('ClazzAddStudentAction').onExecute(function(data){
    apiFactory.post('/clazz/student').drive(this).send(data);
});
module.exports = null;