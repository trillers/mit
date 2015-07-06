define(function (require, exports, module) {
    var domain = require('../domain');
    var action = domain.action('delRnActivity');
    var apiFactory = domain.restApi();

    action.onExecute(function(data){
        var me = this;
        var id = data.id;
        var deleteId = data.deleteId;
        var api = apiFactory.delete("/pa/_" + id + "/deleteNote")
            .done(function(data){
                me.done(data);
            })
            .fail(function(error){
                me.fail(error);
            });
        api.send({deleteId: deleteId});
    });

    module.exports = action;
});