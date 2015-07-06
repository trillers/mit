var DomainBuilder = require('../framework/model/DomainBuilder');
var schema = DomainBuilder
    .i('RandomNote')
    .withCreatedOn()
    .withCreatedBy()
    .withProperties({
        desc: {type: String},
        pics: [{
            id: {type: String, ref: 'Image', required: true}
            , url: {type: String} //url in image cloud
            , mediaId: {type: String} //wechat media id
            , meta: {type: String} //width+height+size+tone(色调)
            , name: {type: String} //filename
        }], //活动海报图片, 可多张，目前页面只允许放一张，以后可以放开
        initiator: {type: String, ref: 'User', default: null, required: false},
        initiatorName: {type: String}
    })
    .build();

module.exports.schema = schema;
module.exports.model = schema.model(true);