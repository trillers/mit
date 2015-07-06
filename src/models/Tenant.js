var mongoose = require('../app/mongoose');
var DomainBuilder = require('../framework/model/DomainBuilder');
var TenantMember = require('./TenantMember').schema;

var schema = DomainBuilder
    .i('Tenant')
    .withBasis()
    .withLifeFlag()
    .withCreatedOn()
    .withCreatedBy()
    .withUpdatedOn()
    .withUpdatedBy()
    .withProperties({
        name: {type: String}
        , contactName: {type: String}
        , phone: {type: String}
        , mail: {type: String}
        , address: {type: String}
        , "members": [TenantMember]
    })
    .build();

module.exports.schema = schema;
module.exports.model = schema.model(true);