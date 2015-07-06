var DomainBuilder = require('../framework/model/DomainBuilder');

var schema = DomainBuilder
    .i('MarketingCampaignStrategy')
    .withBasis()
    .withLifeFlag()
    .withCreatedOn()
    .withCreatedBy()
    .withUpdatedOn()
    .withUpdatedBy()
    .withProperties({
        name: {type: String, required: true} //MarketingCampaignStrategy id
    })
    .build();

module.exports.schema = schema;
module.exports.model = schema.model(true);
