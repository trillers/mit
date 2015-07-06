var DomainBuilder = require('../framework/model/DomainBuilder');
var MarketingCampaignStrategy = require('./MarketingCampaignStrategy');
var schema = DomainBuilder
    .i('MarketingCampaignUser')
    .withBasis()
    .withLifeFlag()
    .withCreatedOn()
    .withCreatedBy()
    .withUpdatedOn()
    .withUpdatedBy()
    .withProperties({
        campaign: {type: String, ref: 'MarketingCampaign', required: true}, //MarketingCampaign id
        user: {
            id: {type: String, ref: 'User', required: true} //User id
            , openid: {type: String} //wechat openid
            , displayName: {type: String} //wechat nickname
            , qrChannel: {type: String, ref: 'QrChannel'}
            , contact: [{
                id: {type: String, ref: 'User'}
            }]
            , contactCount: {type: Number, default: 0}
        },
        strategies: [{
            id: {type: String, ref:'MarketingCampaignStrategy'},
            name: {type: String},
            attended: {type: Boolean, default: false}
        }],
        redPackCount: {type: Number, default: 0},
        desc:  {type: String}
    })
    .build();

module.exports.schema = schema;
module.exports.model = schema.model(true);
