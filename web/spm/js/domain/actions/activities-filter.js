define(function (require, exports, module) {
    var domain = require('../domain');
    var action = domain.action('filterActivities');
    var apiFactory = domain.restApi();
    action.onExecute(function(filter){
        apiFactory.post('/pa/find').drive(this).send({filter: filter});
    });

    module.exports = action;
});