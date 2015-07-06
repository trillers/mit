define(function (require, exports, module) {
    var domain = require('../domain');
    var action = domain.action('multiupimgs4rnActivity');
    var apiFactory = domain.restApi();

    action.onExecute(function(data){
        var me = this;
        var id = data.id;
        var resid = data.resid;
        var api = apiFactory.post("/pa/_" + id + "/uploadNotePic")
            .done(function(data){
                me.done(data);
            })
            .fail(function(error){
                me.fail(error);
            });
        api.send(resid);
    });

    module.exports = action;
});