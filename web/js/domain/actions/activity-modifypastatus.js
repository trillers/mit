define(function (require, exports, module) {
    var domain = require('../domain');
    var action = domain.action('modifyPaStatusActivities');
    var apiFactory = domain.restApi();

    action.onExecute(function(id, status){
        var me = this;
        apiFactory.get("/pa/_" + id +"/"+status)
            .done(function(data){
                me.done({status: status});
            })
            .fail(function(error){
                me.fail({status: status});
            })
            .send();

    });

    module.exports = action;
});