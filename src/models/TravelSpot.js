var DomainBuilder = require('../framework/model/DomainBuilder');
var TravelSpot = require('./TravelSpot').schema;

var schema = DomainBuilder
    .i('TravelSpot')
    .withBasis()
    .withLifeFlag()
    .withCreatedOn()
    .withCreatedBy()
    .withUpdatedOn()
    .withUpdatedBy()
    .withRank()
    .withProperties({
        //main image url
        "desc": String

        , "pics": [String]
    })
    .build();

module.exports.schema = schema;
module.exports.model = schema.model(true);