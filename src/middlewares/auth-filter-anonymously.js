var settings = require('mit-settings');
var AnonymousAuthenticationFilter = require('../framework/AnonymousAuthenticationFilter');
var AnonymousAuthenticator = require('../framework/AnonymousAuthenticator');

var authenticator = new AnonymousAuthenticator({});
var filter = new AnonymousAuthenticationFilter({
    authenticator: authenticator
});
var filterFn = filter.filter.bind(filter);

module.exports = filterFn;
