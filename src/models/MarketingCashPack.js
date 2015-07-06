var DomainBuilder = require('../framework/model/DomainBuilder');
var typeRegistry = require('./TypeRegistry');
var CashPackStatus = typeRegistry.item('CashPackStatus');

var schema = DomainBuilder
    .i('MarketingCashPack')
    .withBasis()
    .withLifeFlag()
    .withCreatedOn()
    .withCreatedBy()
    .withUpdatedOn()
    .withUpdatedBy()
    .withProperties({
        "status": {type: String, enum: CashPackStatus.valueList(), default: CashPackStatus.Created.value(), required: true},
        campaign: {type: String, ref: 'MarketingCampaign', required: true}, //MarketingCampaign id
        receiver: {
            id: {type: String, ref: 'User', required: true} //User id
            , openid: {type: String} //wechat openid
            , displayName: {type: String} //wechat nickname
        },
        minValue: {type: Number},
        maxValue: {type: Number},
        actualValue: {type: Number},
        sentOn: {type: Date},
        receivedOn: {type: Date},
        desc:  {type: String}
    })
    .build();

module.exports.schema = schema;
module.exports.model = schema.model(true);
