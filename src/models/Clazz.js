var mongoose = require('../app/mongoose');
var DomainBuilder = require('../framework/model/DomainBuilder');
var _ = require('underscore');

var schema = DomainBuilder
    .i('Clazz')
    .withBasis()
    .withLifeFlag()
    .withCreatedOn()
    .withProperties({
        name: {type: String, required: true},
        teachers: [{type: String, ref: 'ClazzTeacher'}],
        students: [{type: String, ref: 'ClazzStudent'}],
        qrChannel:{type: String, ref: 'QrChannel'}
    })
    .build();

module.exports.schema = schema;
module.exports.model = schema.model(true);

