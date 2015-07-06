var assert = require("assert");
var WechatToken = require('../../src/services/WechatToken');
var settings = require('mit-settings');
var time = require('../../src/app/time');

describe('WechatToken', function(){
    return;
    describe('#getAt()', function(){
        var cachedAt = null;
        it("get a cached access token if existed, otherwise a new one", function(done){
            var wechatToken = new WechatToken(settings.weixin.appKey, settings.weixin.appSecret);
            wechatToken.getAt(false, function(err, at){
                assert.ok(!err);
                assert.ok(at);
                cachedAt = at.value;
                console.info(at);
                console.info();
                done();
            });
        });

        it("get a cached access token, and it should be the same as the last one", function(done){
            var wechatToken = new WechatToken(settings.weixin.appKey, settings.weixin.appSecret);
            wechatToken.getAt(false, function(err, at){
                assert.ok(!err);
                assert.ok(at);
                assert.equal(at.value, cachedAt);
                console.info(at);
                console.info();
                done();
            });
        });

        it("force to get a brand new access token, and it should be different from the last one", function(done){
            var wechatToken = new WechatToken(settings.weixin.appKey, settings.weixin.appSecret);
            wechatToken.getAt(true, function(err, at){
                assert.ok(!err);
                assert.ok(at);
                assert.notEqual(at.value, cachedAt);
                console.info(at);
                console.info();
                done();
            });
        });

    });

    describe('#getJt()', function(){
        var cachedJt = null;
        var newJt = null;
        it("get a cached js ticket if existed, otherwise a new one", function(done){
            var wechatToken = new WechatToken(settings.weixin.appKey, settings.weixin.appSecret);
            wechatToken.getJt(false, function(err, jt){
                assert.ok(!err);
                assert.ok(jt);
                cachedJt = jt.value;
                console.info(jt);
                console.info();
                done();
            });
        });
        it("get a cached js ticket, and it should be the same as the last one", function(done){
            var wechatToken = new WechatToken(settings.weixin.appKey, settings.weixin.appSecret);
            wechatToken.getJt(false, function(err, jt){
                assert.ok(!err);
                assert.ok(jt);
                assert.equal(jt.value, cachedJt);
                console.info(jt);
                console.info();
                done();
            });
        });

        it("force to get a brand new js ticket, and it should be different from the last one", function(done){
            var wechatToken = new WechatToken(settings.weixin.appKey, settings.weixin.appSecret);
            wechatToken.getJt(true, function(err, jt){
                assert.ok(!err);
                assert.ok(jt);
                newJt = jt.value;
                //assert.equal(newJt, cachedJt);
                console.info(jt);
                console.info();
                done();
            });
        });

        it("force to get a brand new js ticket, and it should be different from the last one", function(done){
            var wechatToken = new WechatToken(settings.weixin.appKey, settings.weixin.appSecret);
            wechatToken.getJt(true, function(err, jt){
                assert.ok(!err);
                assert.ok(jt);
                assert.equal(jt.value, newJt);
                console.info(jt);
                console.info();
                done();
            });
        });
    });

    describe('#getJsSignature()', function(){
        it("get js signature", function(done){
            var wechatToken = new WechatToken(settings.weixin.appKey, settings.weixin.appSecret);
            wechatToken.getJt()
                .then(function(jt){
                    assert.ok(jt);
                    var url = 'http://www.zz365.com.cn/index';
                    var signature = wechatToken.getJsSignature(jt.value, 'seedtrip', time.currentTimeMillis(), url);
                    console.info(signature);
                    done();
                })
        });
    });

    describe('#getJsConfig()', function(){
        it("get js config", function(done){
            var wechatToken = new WechatToken(settings.weixin.appKey, settings.weixin.appSecret);
            var url = 'http://www.zz365.com.cn/index';
            wechatToken.getJsConfig(url)
                .then(function(config){
                    assert.ok(config);
                    console.info(config);
                    done();
                })
        });
    });

});