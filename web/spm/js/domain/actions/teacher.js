var domain = require('../domain');
var apiFactory = domain.restApi();

domain.action('TeacherSignUpAction').onExecute(function(data){
    apiFactory.post('/teacher').drive(this).send(data);
});




module.exports = null;