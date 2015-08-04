var Server = require('socket.io');
var srv = require('./http-server');
var CustomerServer = require('../kvs/CustomerServerPool');
var util = require('./util');
var wechatApi = require('../app/wechat/api').api;
var io = new Server();

io.attach(srv, {serveClient: false});
io.path('/socket.io');

io.on('connection', socketConnected);

function socketConnected(socket){
    socket.on('message', messageHandler);
    socket.on('saveSocket', saveSocketHandler);
}
function messageHandler(data){
    var openId = data.openId;
    var msg = data.msg;
    wechatApi.sendText(openId, msg, function(err, data){
        console.log(data);
    })
}

function saveSocketHandler(data){
    var userId = data;
    var socket = this;
    CustomerServer.saveCSById(userId, socket, function(err){
        //TODO
    });
}
module.exports = null;

