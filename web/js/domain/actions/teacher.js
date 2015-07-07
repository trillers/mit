var domain = require('../domain');
var apiFactory = domain.restApi();

domain.action('TeacherSignUpAction').onExecute(function(data){
    alert(1);
    apiFactory.post('/teacher').drive(this).send(data);
});




module.exports = null;