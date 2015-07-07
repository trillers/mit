var mongoose = require('../app/mongoose');
var DomainBuilder = require('../framework/model/DomainBuilder');
var _ = require('underscore');

var schema = DomainBuilder
    .i('UserBiz')
    .withBasis()
    .withLifeFlag()
    .withCreatedOn()
    .withProperties({
        user: {type: String, ref: 'User', required: true}
    })
    .build();

module.exports.schema = schema;
module.exports.model = schema.model(true);
module.exports.helper = helper;

