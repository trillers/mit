define(function (require, exports, module) {
    var domain = require('../domain');
    var action = domain.action('replyActivity');
    var apiFactory = domain.restApi();

    action.onExecute(function(data){
        var me = this;
        var api = apiFactory.post("/pa/_" + data.id + "/comment")
            .done(function(data){
                me.done(data);
            })
            .fail(function(error){
                me.fail(error);
            });
        api.send(data.data);
    });

    module.exports = action;
});