var MarketingCampaignService = require('../../src/services/MarketingCampaignService');
var inspect = require('util').inspect;
var time = require('../../src/app/time');
var assert = require("assert");
var mocks = {
    campaign:{
        name: '种子旅行关注拿红包',
        startTime:time.currentTime(),
        endTime:time.currentTime(),
        desc:  '这是一个测试',
        code: 'subscribe' + time.currentTime().getTime()
    }
};

describe('MarketingCampaignService', function(){
    describe('#create()', function(){
        before(function(done){
            var redis = require('../../src/app/redis');
            var mongoose = require('../../src/app/mongoose');
            setTimeout(function(){
                done();
            },200);
        });

        it("create an campaign", function(done){
            MarketingCampaignService.create(mocks.campaign,  function(err, campaign){
                assert.ok(!err);
                assert.ok(campaign);
                console.log("campaign-------------" + inspect(campaign));
                done();
            });
        });

    });
});
