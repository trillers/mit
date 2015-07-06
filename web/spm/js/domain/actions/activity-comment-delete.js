define(function (require, exports, module) {
    var domain = require('../domain');
    var action = domain.action('deleteActivityComment');
    var apiFactory = domain.restApi();

    action.onExecute(function(data){
        var me = this;
        apiFactory.delete('/pa/_' + data.id + '/comment')
            .done(function(data){
                me.done(data);
            })
            .fail(function(error){
                me.fail(error);
            }).send({deleteId: data.deleteId});
    });

    module.exports = action;
});