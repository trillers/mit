var settings = require('mit-settings');
var logging = require('./logging');
var logger = logging.logger;
var express = require('express');
var app = module.exports = express();
var swig = require('swig');

//configure application fixtures
app.set('env', 'development' || settings.env.NODE_ENV);//TODO: now it doesn't work if i switch express to production, so use development always now

app.enable('trust proxy'); //TODO: configure it by settings
//app.locals(settings.resources);//TODO: configure it later
app.set('port', process.env.PORT || settings.env.PORT);//TODO: configure it by settings
app.set('bindip', process.env.BINDIP || settings.env.BINDIP);
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/../../src/views');
app.set('view cache', false);
swig.setDefaults({ cache: false });
app.use(logging.applogger);
require('../routes')(app);

var http = require('http');
var env = app.get('env');

var system = require('./system');
system.addMember('application', app);

var server = require('./http-server');
server.on('request', app);

server.listen(app.get('port'), app.get('bindip'), function(){
    logger.info('The server is binding on '+ app.get('bindip') +' and listening on port ' + app.get('port') + ' in ' + env );
    system.memberUp(app);
});

//var wss = require('./wss');

//var server = http.createServer(app).listen(app.get('port'), app.get('bindip'), function(){
//    logger.info('The server is binding on '+ app.get('bindip') +' and listening on port ' + app.get('port') + ' in ' + env );
//    system.memberUp(app);
//});





//require('../rpcs');
