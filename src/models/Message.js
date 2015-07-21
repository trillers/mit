var mongoose = require('../app/mongoose');
var DomainBuilder = require('../framework/model/DomainBuilder');
var MsgChannelType = require('./TypeRegistry').item('MsgChannelType');
var _ = require('underscore');

var schema = DomainBuilder
    .i('Message')
    .withBasis()
    .withLifeFlag()
    .withCreatedOn()
    .withProperties({
        from: {type: String, ref: 'User', required: true},
        to: {type: String, ref: 'User'},
        channel: {type: String, require: true},
        contentType: {type: String, default: 'txt'},
        content: {type: String}
    })
    .build();

module.exports.schema = schema;
module.exports.model = schema.model(true);

