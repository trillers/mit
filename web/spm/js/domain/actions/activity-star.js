define(function (require, exports, module) {
    var domain = require('../domain');
    var action = domain.action('starActivity');
    var apiFactory = domain.restApi();

    action.onExecute(function(id){
        var me = this;
        var api = apiFactory.get("/pa/_"+ id +"/star")
            .done(function(data){
                me.done(data);
            })
            .fail(function(error){
                me.fail(error);
            });
        api.send();
    });

    module.exports = action;
});