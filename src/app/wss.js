var WebSocketServer = require('../framework/WebSocketServer');
var server = require('./http-server');
var wss = new WebSocketServer({
    server: server
    //port: 3020
    //path: 'ws://dev.www.zz365.com.cn/ws'
});
wss.addEventHandler({
    type: 'job_update_activity_status',
    handle: function(ws, msg){
        console.log(msg);
        ws.send(msg.type + ' is done!');
    }
});
wss.start();

module.exports = wss;