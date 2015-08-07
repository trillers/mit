var Server = require('socket.io');
var srv = require('./http-server');
var CSDispatcher = require('../modules/customer_server');
var util = require('./util');
var wechatApi = require('../app/wechat/api').api;
var io = new Server();

io.attach(srv, {serveClient: false});
io.path('/socket.io');

io.on('connection', socketConnected);

function socketConnected(socket){
    socket.on('message', messageHandler);
    socket.on('saveSocket', saveSocketHandler);
    socket.on('disconnect', function(){
        disconnectHandler(socket);
    });
}
function messageHandler(data){
    var openId = data.openId;
    var msg = data.msg;
    wechatApi.sendText(openId, msg, function(err, data){
        console.log(data);
    })
}

function saveSocketHandler(data){
    console.log('save socket');
    var userId = data;
    var socket = this;
    CSDispatcher.registryCustomerServer(userId, socket);
}

function disconnectHandler(socket){
    console.log('got disconnect');
    console.log(socket);
}
module.exports = null;

