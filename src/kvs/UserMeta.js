var redis = require('../app/redis');
var time = require('../app/time');
var logger = require('../app/logging').logger;

var userLikesKey = function(uid){
    return 'usr:' + uid + ':likes';
};

var userLikedActivitiesKey = function(uid){
    return 'usr:' + uid + ':like-activities';
};

var userStarredActivitiesKey = function(uid){
    return 'usr:' + uid + ':star-activities';
};

var userInitiatedActivitiesKey = function(uid){
    return 'usr:' + uid + ':init-activities';
};

var userAppliedActivitiesKey = function(uid){
    return 'usr:' + uid + ':apply-activities';
};


var generateRecordUserMetaAction = function(actionConfig){
    var genKey = actionConfig.genKey;
    var actionName = actionConfig.name;
    return function(uid, actionInfo, callback){
        var key = genKey(uid);
        var undo = actionInfo.undo;
        if(undo){
            redis.zrem(key, actionInfo.id, function(err, result){
                if (err) {
                    logger.error('Fail to UN-'+ actionName +' activity for user [' + uid + ']: ' + err);
                    callback(err, null);
                    return;
                }
                if(callback) callback(null, {undo: true, result: result==1});
            });
        }
        else{
            redis.zadd(key, actionInfo.ts, actionInfo.id, function(err, result){
                if (err) {
                    logger.error('Fail to '+ actionName +' activity for user [' + uid + ']: ' + err);
                    callback(err, null);
                    return;
                }
                if(callback) callback(null, {undo: false, result: result==1});
            });
        }
    };
};

var UserMeta = {
    countLikes: function(uid, callback){
        var key = userLikesKey(uid);
        redis.hlen(key, function(err, result){
            if(err){
                logger.error('Fail to get the length of likes of user ['+uid+']: ' + err);
                callback(err, 0);
                return;
            }
            callback(null, result);
        });
    },
    like: function(uid, thingId, callback){
        var key = userLikesKey(uid);
        redis.hget(key, thingId, function(err, result){
            if(err){
                logger.error('Fail to let user ['+uid+'] toggle to like thing ['+thingId+']: ' + err);
                callback(err);
                return;
            }

            if(result){
                redis.hdel(key, thingId, function(err, result){
                    if(err){
                        logger.error('Fail to let user ['+uid+'] unlike thing ['+thingId+']: ' + err);
                        callback(err);
                        return;
                    }
                    if(result){
                        callback(null, {action: 'unlike', result: true});
                    }
                    else{
                        callback(null, {action: 'unlike', result: false});
                    }
                });

            }
            else{
                redis.hset(key, thingId, time.currentTimeMillis(), function(err, result){
                    if(err){
                        logger.error('Fail to let user ['+uid+'] like thing ['+thingId+']: ' + err);
                        callback(err);
                        return;
                    }

                    if(result){
                        callback(null, {action: 'like', result: true});
                    }
                    else{
                        callback(null, {action: 'like', result: false});
                    }
                });
            }
        });

    },
    getMeta: function(uid, callback){
        var likesKey = userLikesKey(uid);
        var likedActivitiesKey = userLikedActivitiesKey(uid);
        var starredActivitiesKey = userStarredActivitiesKey(uid);

        redis.multi()
            .hgetall(likesKey)
            .zrevrange(likedActivitiesKey, 0, -1)
            .zrevrange(starredActivitiesKey, 0, -1)
            .exec(function (err, replies) {
                if (err) {
                    logger.error('Fail to get meta info of user [' + uid + ']: ' + err);
                    callback(err, null);
                    return;
                }
                var meta = {
                    pa:{}
                };
                meta.likes = replies[0] || {};
                meta.pa.likes = replies[1] || [];
                meta.pa.stars = replies[2] || [];
                callback(null, meta);
            });
    },

    /**
     * user like or unlike a activity.
     * @param uid user id
     * @param thingId activity id
     * @param callback
     */
    likeActivity: function(uid, thingId, callback){
        var key = userLikedActivitiesKey(uid);
        redis.hget(key, thingId, function(err, result){
            if(err){
                logger.error('Fail to let user ['+uid+'] toggle to like thing ['+thingId+']: ' + err);
                callback(err);
                return;
            }

            if(result){
                redis.hdel(key, thingId, function(err, result){
                    if(err){
                        logger.error('Fail to let user ['+uid+'] unlike thing ['+thingId+']: ' + err);
                        callback(err);
                        return;
                    }
                    if(result){
                        callback(null, {action: 'unlike', result: true});
                    }
                    else{
                        callback(null, {action: 'unlike', result: false});
                    }
                });

            }
            else{
                redis.hset(key, thingId, time.currentTimeMillis(), function(err, result){
                    if(err){
                        logger.error('Fail to let user ['+uid+'] like thing ['+thingId+']: ' + err);
                        callback(err);
                        return;
                    }

                    if(result){
                        callback(null, {action: 'like', result: true});
                    }
                    else{
                        callback(null, {action: 'like', result: false});
                    }
                });
            }
        });
    },

    /**
     * record the action that user like activity
     * @param uid
     * @param actionInfo {rank: 1023, id: 'asdf', undo: true/false}
     * @param callback
     */
    recordLikeActivity: generateRecordUserMetaAction({
        name: 'like',
        genKey: userLikedActivitiesKey
    }),

    toggleLikeActivity: function(uid, thingId, callback){
        var key = userLikedActivitiesKey(uid);
        var me = this;
        redis.zrank(key, thingId, function(err, result){
            if(err){
                logger.error('Fail to check if the user ['+uid+'] like thing ['+thingId+']: ' + err);
                callback(err);
                return;
            }

            var undo = result || result===0;
            var ts = time.currentTimeMillis();
            me.recordLikeActivity(uid,
                {
                    id: thingId,
                    ts: ts,
                    undo: undo
                },
                callback);
        });
    },

    getLikedActivities: function(uid, callback){
        var key = userLikedActivitiesKey(uid);
        redis.zrevrange(key, 0, -1, function(err, results){
            if (err) {
                var errmsg = 'Fail to get liked activities of user [' + uid + ']: ' + err
                logger.error(errmsg);
                callback(new Error(errmsg));
                return;
            }

            callback(null, results);
        });
    },

    /**
     * record the action that user star activity
     * @param uid
     * @param actionInfo {rank: 1023, id: 'asdf', undo: true/false}
     * @param callback
     */
    recordStarActivity: generateRecordUserMetaAction({
        name: 'star',
        genKey: userStarredActivitiesKey
    }),

    toggleStarActivity: function(uid, thingId, callback){
        var key = userStarredActivitiesKey(uid);
        var me = this;
        redis.zrank(key, thingId, function(err, result){
            if(err){
                logger.error('Fail to check if the user ['+uid+'] star thing ['+thingId+']: ' + err);
                callback(err);
                return;
            }

            var undo = result || result===0;
            var ts = time.currentTimeMillis();
            me.recordStarActivity(uid,
                {
                    id: thingId,
                    ts: ts,
                    undo: undo
                },
                callback);
        });
    },

    getStarredActivities: function(uid, callback){
        var key = userStarredActivitiesKey(uid);
        redis.zrevrange(key, 0, -1, function(err, results){
            if (err) {
                var errmsg = 'Fail to get starred activities of user [' + uid + ']: ' + err
                logger.error(errmsg);
                callback(new Error(errmsg));
                return;
            }

            callback(null, results);
        });
    },

    /**
     *
     * @param uid
     * @param activityInfo {rank: 1023, id: 'asdf'}
     * @param callback
     */
    addInitiatedActivity: function(uid, activityInfo, callback){
        var key = userInitiatedActivitiesKey(uid);
        redis.zadd(key, activityInfo.rank, activityInfo.id, function(err, result){
            if (err) {
                logger.error('Fail to add initiated activity of user [' + uid + ']: ' + err);
                callback(err, null);
                return;
            }
            if(result==1){
                if(callback) callback(null, true);
            }
            else{
                if(callback) callback(null, false);
            }
        });
    },

    getInitiatedActivities: function(uid, callback){
        var key = userInitiatedActivitiesKey(uid);
        redis.zrange(key, 0, -1, function(err, results){
            if (err) {
                logger.error('Fail to get initiated activities of user [' + uid + ']: ' + err);
                callback(err, null);
                return;
            }

            callback(null, results);
        });
    },

    /**
     *
     * @param uid
     * @param activityInfo {rank: 1023, id: 'asdf'}
     * @param callback
     */
    addAppliedActivity: function(uid, activityInfo, callback){
        var key = userAppliedActivitiesKey(uid);
        redis.zadd(key, activityInfo.rank, activityInfo.id, function(err, result){
            if (err) {
                logger.error('Fail to add applied activity of user [' + uid + ']: ' + err);
                callback(err, null);
                return;
            }
            if(result==1){
                if(callback) callback(null, true);
            }
            else{
                if(callback) callback(null, false);
            }
        });
    },

    getAppliedActivities: function(uid, callback){
        var key = userAppliedActivitiesKey(uid);
        redis.zrange(key, 0, -1, function(err, results){
            if (err) {
                logger.error('Fail to get applied activities of user [' + uid + ']: ' + err);
                callback(err, null);
                return;
            }

            callback(null, results);
        });
    }

};
module.exports = UserMeta;