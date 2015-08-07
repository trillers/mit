var redis = require('../../../app/redis');
var logger = require('../../../app/logging').logger;
var _ = require('underscore');
var Promise = require('bluebird');
var cbUtil = require('../../../framework/callback');

var idToCSStatusKey = function(id){
    return 'cs:st:' + id;
};

var idToCSHandingSetKey = function(id){
    return 'cs:set:' + id;
}

var getCSLoadKey = function(){
    return 'cs:load';
}

var openIdToCSSKey = function(openId){
    return 'cs:sess:' + openId;
}

var CustomerServer = {
    loadCSStatusById: function(id, callback){
        var key = idToCSStatusKey(id);
        redis.get(key, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to load customer server status by id ' + id + ': ' + err,
                'Succeed to load customer server status by id ' + id);
            cbUtil.handleSingleValue(callback, err, result);
        });
    },

    saveCSStatusById: function(id, st, callback){
        var key = idToCSStatusKey(id);
        redis.set(key, st, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to save customer server status by id: ' + id + ': ' + err,
                'Succeed to save customer server status by id: ' + id);
            cbUtil.handleOk(callback, err, result, st);
        });
    },

    delCSStatusById: function(id, callback){
        var key = idToCSStatusKey(id);
        redis.del(key, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to delete customer server status by id ' + id + ': ' + err,
                'Succeed to delete customer server by status id ' + id);

            cbUtil.handleSingleValue(callback, err, result);
        });
    },

    loadCSSByOpenId: function(openId, callback){
        var key = openIdToCSSKey(openId);
        redis.hgetall(key, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to load customer server session by openId ' + openId + ': ' + err,
                'Succeed to load customer server session by openId ' + openId);
            cbUtil.handleSingleValue(callback, err, result);
        });
    },

    saveCSSByOpenId: function(openId, css, callback){
        var key = openIdToCSSKey(openId);
        redis.hmset(key, css, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to save customer server session by openId: ' + openId + ': ' + err,
                'Succeed to save customer server session by openId: ' + openId);
            cbUtil.handleOk(callback, err, result, css);
        });
    },

    delCSSByOpenId: function(openId, callback){
        var key = openIdToCSSKey(openId);
        redis.del(key, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to delete customer server session by openId ' + openId + ': ' + err,
                'Succeed to delete customer server session by openId ' + openId);

            cbUtil.handleSingleValue(callback, err, result);
        });
    },

    loadCSHandingSetById: function(id, callback){
        var key = idToCSHandingSetKey(id);
        redis.smembers(key, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to load customer server handing set by id ' + id + ': ' + err,
                'Succeed to load customer server handing set by id ' + id);
            cbUtil.handleSingleValue(callback, err, result);
        });
    },

    pushCSHandingSetById: function(id, openId, callback){
        var key = idToCSHandingSetKey(id);
        redis.sadd(key, openId, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to add customer server handing set by id: ' + id + ': ' + err,
                'Succeed to add customer server handing set by id: ' + id);
            cbUtil.handleAffected(callback, err, openId, result);
        });
    },

    popCSHandingSetById: function(id, openId, callback){
        var key = idToCSHandingSetKey(id);
        redis.srem(key, openId, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to pop customer server handing set by id ' + id + ': ' + err,
                'Succeed to pop customer server handing set status id ' + id);

            cbUtil.handleAffected(callback, err, openId, result);
        });
    },

    delCSHandingSetById: function(id, callback){
        var key = idToCSHandingSetKey(id);
        redis.del(key, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to delete customer server handing set by id ' + id + ': ' + err,
                'Succeed to delete customer server handing set by id ' + id);

            cbUtil.handleSingleValue(callback, err, result);
        });
    },

    loadCSLoad: function(callback){
        var key = getCSLoadKey();
        redis.hgetall(key, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to load customer server load ' + err,
                'Succeed to load customer server load');
            cbUtil.handleSingleValue(callback, err, result);
        });
    },

    setCSLoadById: function(id, callback){
        var key = getCSLoadKey();
        redis.hset(key, id, 0, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to set customer server load ' + err,
                'Succeed to set customer server load');
            cbUtil.handleAffected(callback, err, id, result);
        });
    },

    modifyCSLoadById: function(id, num, callback){
        var key = getCSLoadKey();
        redis.hincrby(key, id, num, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to modify customer server by id: ' + id + ': ' + err,
                'Succeed to save customer server by id: ' + id);
            cbUtil.handleSingleValue(callback, err, result);
        });
    },

    delCSLoadById: function(id, callback){
        var key = getCSLoadKey();
        redis.hdel(key, id, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to delete customer server load by id: ' + id + 'err:' + err,
                'Succeed to delete customer server load by id:' + id );

            cbUtil.handleAffected(callback, err, id, result);
        });
    },

};

CustomerServer = Promise.promisifyAll(CustomerServer);

module.exports = CustomerServer;