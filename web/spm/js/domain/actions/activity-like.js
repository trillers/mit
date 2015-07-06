define(function (require, exports, module) {
    var domain = require('../domain');
    var action = domain.action('likeActivity');
    var apiFactory = domain.restApi();

    action.onExecute(function(id){
        //apiFactory.get('/pa/_' + id + '/like').drive(this).send();
        var me = this;
        var api = apiFactory.get('/pa/_' + id + '/like')
            .done(function(data){
                var likeModel = {
                    no : data,
                    id: id
                }
                me.done(likeModel);
            })
            .fail(function(error){
                me.fail(error);
            });
        api.send();
    });

    module.exports = action;
});