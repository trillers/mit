var assert = require("assert");
var WechatOperationService = require('../../src/services/WechatOperationService');

describe('WechatOperationService', function(){
    describe('logAction', function(){
        it("subscribe", function(done){
            var msg = {
                Event: 'subscribe',
                EventKey: 'qrscene_177'
            };
            var user = {
                subscribeCount: 0
            }
            WechatOperationService.logAction(msg, user, function(err, result){
                assert.ok(!err);
                assert.equal(result, 1);
                done();
            });
        });

        it("ubsubscribe", function(done){
            var msg = {
                Event: 'unsubscribe',
            };
            var user = {
                channelFrom: '177',
                subscribeCount: 1
            }
            WechatOperationService.logAction(msg, user, function(err, result){
                assert.ok(!err);
                assert.equal(result, 1);
                done();
            });
        });

    });

});
