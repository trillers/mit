define(function (require, exports, module) {
    var domain = require('../domain');
    var action = domain.action('applicationActivity');
    var apiFactory = domain.restApi('applicationActivity', {baseUrl: ''});

    action.onExecute(function(data){
        var applicationModel = data.temp;
        var id = data.id;
        var me = this;
        apiFactory.post("/pa/_" + id + "?action=new")
            .done(function(data){
                var appsModel = {
                    apps : data,
                    id: id
                }
                me.done(appsModel);
            })
            .fail(function(error){
                me.fail(error);
            })
            .send(applicationModel);

    });

    module.exports = action;
});