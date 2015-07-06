var settings = require('mit-settings').logging;
var log4js = require('log4js');
log4js.configure(__dirname + '/logging.json', { reloadSecs: settings.reloadSecs });
var applogger = log4js.getLogger('app');
module.exports = {
    applogger: log4js.connectLogger(applogger, { level: settings.level }),
    logger: applogger
};
