var domain = require('../domain');
var apiFactory = domain.restApi();

domain.action('ClazzAddAction').onExecute(function(data){
    apiFactory.post('/clazz').drive(this).send(data);
});




module.exports = null;