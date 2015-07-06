var DomainBuilder = require('../framework/model/DomainBuilder');
var TravelSpot = require('./TravelSpot').schema;

var schema = DomainBuilder
    .i('TravelElement')
    .withBasis()
    .withLifeFlag()
    .withCreatedOn()
    .withCreatedBy()
    .withUpdatedOn()
    .withUpdatedBy()
    .withRank()
    .withProperties({
        //main image url
        "name": String //"http://making-photos.b0.upaiyun.com/photos/2a7343fa66062c66c31586473124f009.jpg!normal",

        , "spots": [TravelSpot]
    })
    .build();

module.exports.schema = schema;
module.exports.model = schema.model(true);