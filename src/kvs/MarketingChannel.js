var redis = require('../app/redis');
var logger = require('../app/logging').logger;
var Promise = require('bluebird');
var cbUtil = require('../framework/callback');

var sceneSequenceKey = function(id){
    return 'mc:scene:seq';
};

var INITIAL_SCENE_ID = 100;

var MarketingChannel = {
    nextSceneId: function(callback){
        var key = sceneSequenceKey();
        redis.incr(key, function(err, seq){
            if(err){
                //TODO: error handling
            }
            else if(seq==1){
                redis.set(key, INITIAL_SCENE_ID, function(err, result){
                    cbUtil.handleOk(callback, err, result, INITIAL_SCENE_ID);
                });
            }
            else{
                cbUtil.handleSingleValue(callback, err, seq);
            }
        });
    },
    deleteSceneId: function(callback){
        var key = sceneSequenceKey();
        redis.del(key, function(err, result){
            cbUtil.handleSingleValue(callback, err, result);
        });
    }

};

MarketingChannel = Promise.promisifyAll(MarketingChannel);
module.exports = MarketingChannel;