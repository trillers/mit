define(function (require, exports, module) {
    var domain = require('../domain');
    var action = domain.action('createRnActivity');
    var apiFactory = domain.restApi();

    action.onExecute(function(data){
        var me = this;
        var id = data.id;
        var data = data.data;
        var api = apiFactory.post("/pa/_" + id + "/sendNote")
            .done(function(data){
                me.done(data);
            })
            .fail(function(error){
                me.fail(error);
            });
        api.send(data);
    });

    module.exports = action;
});