var assert = require("assert");
var MarketingChannel = require('../../src/kvs/MarketingChannel');

describe('MarketingChannel', function(){
    describe('nextSceneId', function(){
        before(function(done){
            MarketingChannel.deleteSceneId(function(err){
                assert.ok(!err);
                done();
            });
        });

        it("initial scene id", function(done){
            MarketingChannel.nextSceneId(function(err, result){
                assert.ok(!err);
                assert.equal(result, 100);
                done();
            });
        });

        describe('increment with one', function(){
            var sceneId = 0;
            it("first time invocation", function(done){
                MarketingChannel.nextSceneId(function(err, result){
                    assert.ok(!err);
                    sceneId = result;
                    done();
                });
            });
            it("second time invocation", function(done){
                MarketingChannel.nextSceneId(function(err, result){
                    assert.ok(!err);
                    assert.equal(result, sceneId+1);
                    done();
                });
            });

        });

    });

});