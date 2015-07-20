// sub clazz:clazzId  {from: userId, to: clazzId, payload: 'content'}
// sub usr:relationship {from: userId, to: userId, payload: 'xxx'}
// relationship userId1 userId2
//
var pubcli = require('redis').createClient();
var subcli = require('redis').createClient();
var redis = require('redis');
var user = {
    clazzs: ['1', '2', '3']
}
var clazzRegx = new RegExp('/clazz/ig');
var userRegx = new RegExp('/usr/');
//var SubDispatcher = function SubDispatcher(){
//
//}
//SubDispatcher.prototype.registry = function(handler){
//    this.handlers[key] = handler;
//}
//var subDispatcher = new SubDispatcher();
//subDispatcher.registry({
//    handle: function(){
//
//    }
//});
subevent();
//student
function subevent(){
    var channel = 'clazz:' + user.clazzs[1];
    //sub owned clazz and relationship
    subcli.psubscribe("*");
    subcli.on('psubscribe', function(){
        subcli.psubscribe('xxx', function(){

        })
    })
    subcli.on('pmessage', function(pattern, channel, msg){
        console.log(msg);

        //handler.handle();
        //channel --> clazz --> push to everybody in clazz and push to set
        //if(channel.test(clazzRegx)){
        //    console.log('do something clazz');
        //}
        ////channel --> user --> push msg to user && push to set
        //else if(channel.test(userRegx)){
        //    console.log('do something usr');
        //}
        //else{
        //    console.log('de nothing');
        //}
    })
}

//在线就推送，不在线发客服消息
//teacher
setTimeout(function(){
    for(var i= 0,len=user.clazzs.length; i<len; i++){
        //get the clazz
        pubcli.publish('clazz:' + user.clazzs[i], JSON.stringify({payload: "hello ,you are in class" + i}))
        //get relationship
        pubcli.publish('user' ,JSON.stringify({'usr': 12}))
    }
},300);



