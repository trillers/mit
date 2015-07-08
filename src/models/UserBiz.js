var mongoose = require('../app/mongoose');
var DomainBuilder = require('../framework/model/DomainBuilder');
var ClazzBrief = require('./ClazzBrief').schema;
var _ = require('underscore');

var schema = DomainBuilder
    .i('UserBiz')
    .withBasis()
    .withLifeFlag()
    .withCreatedOn()
    .withProperties({
        user: {type: String, ref: 'User', required: true},
        classes: [ClazzBrief]
    })
    .build();

module.exports.schema = schema;
module.exports.model = schema.model(true);

