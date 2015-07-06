var mongoose = require('mongoose')
    , Schema = mongoose.Schema;
var DomainBuilder = require('../framework/model/DomainBuilder');
var schema = DomainBuilder
    .i('ChannelAnalysis')
    .withBasis()
    .withProperties({
        channelName: {type: String},
        scene_id: {type: Number},
        totalFollows: {type: Number, default: 0},
        effectiveFollows: {type: Number, default: 0},
        unFollows: {type: Number, default: 0},
        updateOn: {type: Date}
    })
    .build();

module.exports.schema = schema;
module.exports.model = schema.model(true);

