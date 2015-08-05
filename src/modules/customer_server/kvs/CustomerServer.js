var redis = require('../../../app/redis');
var logger = require('../../../app/logging').logger;
var _ = require('underscore');
var Promise = require('bluebird');
var cbUtil = require('../../../framework/callback');

var getCSKey = function(){
    return 'cs';
};

var idToCSKey = function(id){
    return 'cs:' + id;
}

var idToCSField = function(id){
    return 'cs' + id;
}

var openIdToCSSKey = function(openId){
    return 'cs:session:' + openId;
}

var CustomerServerPool = {
    loadCSById: function(id, callback){
        var key = idToCSKey(id);
        redis.hgetall(key, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to load customer server by id ' + id + ': ' + err,
                'Succeed to load customer server by id ' + id);
            cbUtil.handleSingleValue(callback, err, result);
        });
    },

    saveCSById: function(id, cs, callback){
        var key = idToCSKey(id);
        redis.hmset(key, cs, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to save customer server by id: ' + id + ': ' + err,
                'Succeed to save customer server by id: ' + id);
            cbUtil.handleOk(callback, err, result);
        });
    },

    deleteCSById: function(id, callback){
        var key = idToCSField(id);
        redis.del(key, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to delete customer server by id ' + id + ': ' + err,
                'Succeed to delete customer server by id ' + id);

            cbUtil.handleSingleValue(callback, err, result);
        });
    },

    loadCSSByOpenId: function(openId, callback){
        var key = openIdToCSSKey(openId);
        redis.get(key, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to load customer server session by customer openId ' + openId + ': ' + err,
                'Succeed to load customer server session by customer openId ' + openId);
            cbUtil.handleSingleValue(callback, err, result);
        });
    },

    saveCSSByOpendId: function(openId, csId, callback){
        var key = openIdToCSSKey(openId);
        redis.set(key, cs, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to save customer server session by customer openId: ' + openId + ': ' + err,
                'Succeed to save customer server session by customer openId: ' + openId);
            cbUtil.handleOk(callback, err, result, csId);
        });
    },

    deleteCSSByOpenId: function(openId, callback){
        var key = openIdToCSSKey(openId);
        redis.del(key, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to delete customer server session by customer openId ' + openId + ': ' + err,
                'Succeed to delete customer server session by customer openId ' + openId);

            cbUtil.handleSingleValue(callback, err, result);
        });
    }

};


CustomerServerPool = Promise.promisifyAll(CustomerServerPool);

module.exports = CustomerServerPool;