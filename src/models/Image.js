var DomainBuilder = require('../framework/model/DomainBuilder');
var schema = DomainBuilder
    .i('Image')
    .withCreatedOn()
    .withCreatedBy()
    .withProperties({
        pvd: {type: String, enum: ['in', 'qn', 'yp'], default: 'qn'} //provider: internal, qinui, yupoo
        , bkt: {type: String} //bucket: it is a image cloud's mgt. unit
        , url: {type: String} //image url in image cloud cdn
        , localId: {type: String}
        , name: {type: String} //image original file name
        , ext: {type: String} //image original file ext.
        , mediaId: {type: String} //wechat media id
        , review: {type: String, default: 'ok'} //review status by operation team
        , "meta": {
            "width": {type: Number, default: 0}
            , "height": {type: Number, default: 0}
            , "size": {type: Number, default: 0}
            , "tone": {type: String, default: ''}
        }
    })
    .build();

module.exports.schema = schema;
module.exports.model = schema.model(true);