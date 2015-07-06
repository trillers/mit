define(function (require, exports, module) {
    var domain = require('../domain');
    var action = domain.action('loadContact');
    var apiFactory = domain.restApi();

    action.onExecute(function(id){
        var me = this;
        apiFactory.get('/user/_' + id + "/contact")
            .done(function(data){
                me.done(data);
            })
            .fail(function(error){
                me.fail(error);
            })
            .send();

    });
    module.exports = action;
});