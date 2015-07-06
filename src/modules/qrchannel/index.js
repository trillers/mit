var QrHandlerDispatcher = require('./common/QrHandlerDispatcher');
var QrChannel = require('./models/QrChannel');

var dispatcher = new QrHandlerDispatcher();

dispatcher.register(require('./handlers/MarketingChannelHandler'));
dispatcher.register(require('./handlers/CustomChannelHandler'));
dispatcher.setNullHandler(require('./handlers/NullHandler'));
dispatcher.setDefaultHandler(require('./handlers/DefaultHandler'));

module.exports = dispatcher;