var mongoose = require('../app/mongoose');
var DomainBuilder = require('../framework/model/DomainBuilder');

var schema = DomainBuilder
    .i('TenantMember')
    .withBasis()
    .withLifeFlag()
    .withCreatedOn()
    .withCreatedBy()
    .withUpdatedOn()
    .withUpdatedBy()
    .withProperties({
        displayName: {type: String, default: '合作方'}
        , headImgUrl: {type: String}
        , "userId": {type: String, ref: 'User', default: null, required: false}
        , wx_openid: {type: String} //weixin openid

    })
    .build();

module.exports.schema = schema;
module.exports.model = schema.model(true);