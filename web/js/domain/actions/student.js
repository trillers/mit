var domain = require('../domain');
var apiFactory = domain.restApi();

domain.action('StudentAddAction').onExecute(function(data){
    apiFactory.post('/clazz/stu').drive(this).send(data);
});

module.exports = null;