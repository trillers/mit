var mongoose = require('../app/mongoose');
var DomainBuilder = require('../framework/model/DomainBuilder');
var _ = require('underscore');

var schema = DomainBuilder
    .i('Message')
    .withBasis()
    .withLifeFlag()
    .withCreatedOn()
    .withProperties({
        from: {type: String, ref: 'User', required: true},
        to: {type: String, ref: 'User', required: true},
        type: {type: String},
        content: {type: String},
        multiOrNot: {type: String}
    })
    .build();

module.exports.schema = schema;
module.exports.model = schema.model(true);
module.exports.helper = helper;

