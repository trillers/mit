var Server = require('socket.io');
var srv = require('./http-server');
var util = require('./util');
var io = new Server();

io.attach(srv, {serveClient: false});
io.path('/socket.io');

io.on('connection', socketConnected);

function socketConnected(socket){
    socket.on('hello', helloHandler);
}
function helloHandler(data){
    console.log(data)
    setTimeout(function(){
        io.emit('res', {msg: 'hello'})
    },1000)
}
module.exports = null;

