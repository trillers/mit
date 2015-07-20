var WebSocketServer = require('../framework/WebSocketServer');
var server = require('./http-server');
var wss = new WebSocketServer({
    servr: server,
    port: 3020,
    path: 'ws://ci.bot.bao.nong600.com/ws'
});
//wss.addEventHandler({
//    type: 'job_update_activity_status',
//    handle: function(ws, msg){
//        console.log(msg);
//        ws.send(msg.type + ' is done!');
//    }
//});
wss.start();

module.exports = wss;