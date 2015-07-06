var DomainBuilder = require('../framework/model/DomainBuilder');
var Strategy = require('./MarketingCampaignStrategy').schema;
var schema = DomainBuilder
    .i('MarketingCampaign')
    .withBasis()
    .withLifeFlag()
    .withCreatedOn()
    .withCreatedBy()
    .withUpdatedOn()
    .withUpdatedBy()
    .withRank()
    .withProperties({
        name: {type: String},
        startTime:{type:Date},
        endTime:{type:Date},
        desc:  {type: String},
        code: {type: String},
        strategies: [Strategy]
    })
    .build();

module.exports.schema = schema;
module.exports.model = schema.model(true);
