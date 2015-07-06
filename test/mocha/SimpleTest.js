var assert = require("assert");
var Promise = require("bluebird");
var wechat = require("../../src/app/wechat/api");
var redis = require("../../src/app/redis");

var key = 'test';
var setValue = function(value, callback){
    redis.set(key, value, function(err, result){
        if(err){
            if(callback) callback(err);
        }
        else{
            if(callback) callback(null, result);
        }
    });
};
var setValueAsync = Promise.promisify(setValue);
var setValueRedisAsync = Promise.promisify(redis.set).bind(redis);


var getValue = function(callback){
    redis.get(key, function(err, result){
        if(err){
            if(callback) callback(err);
        }
        else{
            if(callback) callback(null, result);
        }
    });
};
var getValueAsync = Promise.promisify(getValue);
var getValueRedisAsync = Promise.promisify(redis.get).bind(redis);


var getUser = function(openid, callback){
    wechat.api.getUser(openid, function(err, user){
        callback(null, user);
        //if(err){
        //    if(callback) callback(err);
        //}
        //else{
        //    if(callback) callback(null, user);
        //}
    });
};
var getUserAsync = Promise.promisify(getUser);
var getUserApiAsync = Promise.promisify(wechat.api.getUser).bind(wechat.api);

describe('bluebird promise', function(){
    describe('redis get and set', function(){
        it("set and get value", function(done){
            var v = 'hello';
            setValueAsync(v)
                .then(function(result){
                    return getValueAsync();
                })
                .then(function(value){
                    console.log(value);
                    assert.equal(value, v);
                    done();
                });
        });

        it("set and get value with redis", function(done){
            var v = 'hello';
            setValueRedisAsync(key, v)
                .then(function(result){
                    return getValueRedisAsync(key);
                })
                .then(function(value){
                    console.log(value);
                    assert.equal(value, v);
                    done();
                });
        });
    });

    describe('wechat get user', function(){
        var openid = 'oqSpUuDlnKxHxwZa4xylKuyxaXNM'; //包三哥测试账号

        it("get user using api callback with promise", function(done){
            var v = 'hello';
            setValueAsync(v)
                .then(function(result){
                    return getUserAsync(openid);
                })
                .then(function(user){
                    console.log(user);
                    done();
                });
        });

        it("get user using api with promise chain", function(done){
            var v = 'hello';
            setValueRedisAsync(key, v)
                .then(function(result){
                    return getUserApiAsync(openid);
                })
                .then(function(user){
                    console.log(user);
                    done();
                });
        });

        it("get user using raw api with promise", function(done){
            var v = 'hello';
            getUserApiAsync(openid)
                .then(function(user){
                    console.log(user);
                    done();
                });
        });

    });
});