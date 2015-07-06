require('./initon')(); //预加载和初始化
var settings = require('mit-settings');
var logger = require('./logging').logger;

var system = require('./system');
var application = require('./application');
var schedule = require('../jobs/schedule');


system.addMember('application', application);
system.startup();
system.on('up', function(){
     logger.info('system is up!!!');
});
system.on('down', function(){
    logger.info('system is down!!!');
});
