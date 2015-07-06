var settings = require('mit-settings');
var AuthenticationFilter = require('../framework/AuthenticationFilter');

var filter = new AuthenticationFilter({
    context: '/' //TODO
});

var filterFn = filter.filter.bind(filter);

module.exports = filterFn;
