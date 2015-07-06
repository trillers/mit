var DomainBuilder = require('../framework/model/DomainBuilder');
var schema = DomainBuilder
    .i('Comment')
    .withCreatedOn()
    .withCreatedBy()
    .withProperties({
        comment: {type: String},
        commenter: {type: String, ref: 'User', default: null, required: false},
        commenterName: {type: String},
        reviewStatus: {type: String, default: 't'},
        replyTo:   {type: String, ref: 'User', default: null, required: false},
        replyToName: {type: String}
    })
    .build();

module.exports.schema = schema;
module.exports.model = schema.model(true);