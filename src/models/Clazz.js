var mongoose = require('../app/mongoose');
var DomainBuilder = require('../framework/model/DomainBuilder');
var ClazzTeacher = require('./ClazzTeacher').schema;
var ClazzStudent = require('./ClazzStudent').schema;
var _ = require('underscore');

var schema = DomainBuilder
    .i('UserBiz')
    .withBasis()
    .withLifeFlag()
    .withCreatedOn()
    .withProperties({
        name: {type: String, required: true},
        teachers: [{type: String, ref: ClazzTeacher}],
        students: [{type: String, ref: ClazzStudent}]
    })
    .build();

module.exports.schema = schema;
module.exports.model = schema.model(true);
module.exports.helper = helper;

