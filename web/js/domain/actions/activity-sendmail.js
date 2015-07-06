define(function (require, exports, module) {
    var domain = require('../domain');
    var action = domain.action('sendMailActivities');
    var apiFactory = domain.restApi();

    action.onExecute(function(mailmodel){
        var me = this;
        apiFactory.get("/pa/_" + mailmodel._id +"/applications?action=mail&mailbox=" + mailmodel.mailboxName + "&name=" + mailmodel.name)
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