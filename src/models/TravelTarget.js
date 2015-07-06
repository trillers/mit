var mongoose = require('../app/mongoose');
var logger = require('../app/logging').logger;
var DomainBuilder = require('../framework/model/DomainBuilder');
var Comment = require('./Comment').schema;
var TravelElement = require('./TravelElement').schema;

var schema = DomainBuilder
    .i('TravelTarget')
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

        //other image urls
        , "coverPics": [String]

        //the original url of the deal
        , "promotionWords": String //"http://making-photos.b0.upaiyun.com/photos/2a7343fa66062c66c31586473124f009.jpg!normal"

        //the original website of the deal: it is id of site which is maintain in other collections
        , "highlights": String

        //short description as a title for marketing
        , "summary": String//"Jawbone UP 2nd Generation - 你的生活小秘书"

        , "elements": [TravelElement]
        , "comments": [Comment] //only recent 10 comments here
        , "tags": {
            "region": { type: String},
            "custom": { type: String}
        }
        , "meta": {
            "views": { type: Number, default: 0 },
            "likes": { type: Number, default: 0 }
        }
    })
    .build();


    var metaAction = function (prop, incOp) {
        var metaProp = 'meta.'+prop;
        var update = { $inc: {}};
        update.$inc[metaProp] = incOp ? 1 : -1;
        return function (thingId, uid, callback){
            this.findByIdAndUpdate(
                thingId,
                update,
                {select:[metaProp]},
                function(err, thing){
                    if(err){
                        logger.error(err);
                        callback(err);
                        return;
                    }
                    logger.debug(thing);
                    if(thing){
                        thing.meta = thing.meta || {};
                        callback(null, thing.meta[prop]);
                    }
                    else{
                        callback(null, 0);
                    }
                }
            );
        }
    };

    schema.method('clone', function (uid) {
        var hostObject = this.toObject({getters: true});
        var M = schema.model();
        var cloned = new M(hostObject);
        cloned.autoId(true);
        cloned.autoUpdatedOn(cloned.autoCreatedOn(new Date()));
        cloned.autoUpdatedBy(cloned.autoCreatedBy(uid));
        return cloned;
    });

    schema.static('list', function (ids, callback) {
        if(!ids || ids.length==0){
            callback(null, []);
            return null;
        }
        return this.find(
            {_id: {$in: ids}},
            function(err, docs){
                if(err){
                    logger.error(err);
                    callback(err);
                    return;
                }
                callback(null, docs);
            }
        );
    });

    schema.static('like', metaAction('likes', true));
    schema.static('unlike', metaAction('likes', false));

module.exports.schema = schema;
module.exports.model = schema.model(true);