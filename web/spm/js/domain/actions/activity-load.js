define(function (require, exports, module) {
    var domain = require('../domain');
    var action = domain.action('loadActivity');
    var apiFactory = domain.restApi();

    action.onExecute(function(id){
        var me = this;
        apiFactory.get('/pa/_' + id)
            .done(function(data){
                me.done(data);
            })
            .fail(function(error){
                me.fail(error);
            })
            .send();//"7vxYm"

    });
    module.exports = action;
});