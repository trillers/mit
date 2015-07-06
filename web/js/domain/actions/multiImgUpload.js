define(function (require, exports, module) {
    var domain = require('../domain');
    var action = domain.action('multiImgUpload');
    var apiFactory = domain.restApi();

    action.onExecute(function(data){
        var me = this;
        apiFactory.post('/img/images')
            .done(function(data){
                me.done(data);
            })
            .fail(function(error){
                me.fail(error);
            })
            .send(data);

    });
    module.exports = action;
});
