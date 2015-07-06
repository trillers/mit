var domain = require('../domain');
var apiFactory = domain.restApi();

domain.action('filterActivities').onExecute(function(filter){
    apiFactory.post('/pa/find').drive(this).send({filter: filter});
});

domain.action('loadActivity').onExecute(function(id){
    apiFactory.get('/pa/_' + id).drive(this).send();
});

domain.action('commentActivity').onExecute(function(data){
    apiFactory.post("/pa/_" + data.id + "/comment").drive(this).send(data.data);
});

domain.action('deleteActivityComment').onExecute(function(data){
    apiFactory.delete('/pa/_' + data.id + '/comment').drive(this).send({deleteId: data.deleteId});
});

domain.action('createRnActivity').onExecute(function(data){
    apiFactory.post("/pa/_" + data.id + "/sendNote").drive(this).send(data.data);
});

domain.action('delRnActivity').onExecute(function(data){
    apiFactory.delete("/pa/_" + data.id + "/deleteNote").drive(this).send({deleteId: data.deleteId});
});

domain.action('likeActivity').onExecute(function(id){
    apiFactory.get('/pa/_' + id + '/like').drive(this).send();
});

domain.action('modifyStatusActivities').onExecute(function(id, status){
    apiFactory.get("/pa/_" + id +"/"+status).drive(this).send();
});

domain.action('multiupimgs4rnActivity').onExecute(function(data){
    apiFactory.post("/pa/_" + data.id + "/uploadNotePic").drive(this).send(data.resid);
});

domain.action('replyActivity').onExecute(function(data){
    apiFactory.post("/pa/_" + data.id + "/comment").drive(this).send(data.data);
});

domain.action('sendMailActivities').onExecute(function(mailmodel){
    apiFactory.get("/pa/_" + mailmodel._id +"/applications?action=mail&mailbox=" + mailmodel.mailboxName + "&name=" + mailmodel.name).drive(this).send();
});

domain.action('starActivity').onExecute(function(id){
    apiFactory.get("/pa/_"+ id +"/star").drive(this).send();
});

domain.action('loadContact').onExecute(function(id){
    apiFactory.get('/user/_' + id + "/contact").drive(this).send();
});

domain.action('multiImgUpload').onExecute(function(data){
    apiFactory.post('/img/images').drive(this).send(data);

});

domain.action('applyActivity').onExecute(function(data){
    apiFactory.post("/pa/_" + data.id + "/apply").drive(this).send(data.temp);
});

domain.action('judgeIfTenantMember').onExecute(function(data){
    apiFactory.get('/tenant/_'+ data.tenantId + '/ifTenantMember').drive(this).send({wx_openid: data.wx_openid});
});

domain.action('applicantLoadMore').onExecute(function(id, filter){
    apiFactory.post('/pa/_'+ id + '/applications').drive(this).send({filter: filter});
});

module.exports = null;