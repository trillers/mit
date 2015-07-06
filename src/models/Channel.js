var DomainBuilder = require('../framework/model/DomainBuilder');
var schema = DomainBuilder
    .i('Channel')
    .withBasis()
    .withCreatedOn()
    .withCreatedBy()
    .withProperties({
        channelName: {type: String},
        ticket:{type:String},
        scene_id:{type:Number},
        follows:{type:Number,default:0},
        unFollows:{type:Number,default:0}
    })
    .build();

module.exports.schema = schema;
module.exports.model = schema.model(true);
