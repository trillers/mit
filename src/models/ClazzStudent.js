var mongoose = require('../app/mongoose');
var DomainBuilder = require('../framework/model/DomainBuilder');
var _ = require('underscore');

var schema = DomainBuilder
    .i('ClazzStudent')
    .withBasis()
    .withLifeFlag()
    .withCreatedOn()
    .withProperties({
        user: {type: String, ref: 'User', required: true},
        name: {type: String},
        phone: {type: String},
        headUrl: {type: String}
    })
    .build();

module.exports.schema = schema;
module.exports.model = schema.model(true);

