var MarketingCampaignService = require('../../src/services/MarketingCampaignService');
var MarketingCashPackService = require('../../src/services/MarketingCashPackService');
var inspect = require('util').inspect;
var time = require('../../src/app/time');
var logger = require('../../src/app/logging').logger;
var mocks = {
    campaign:{
        name: '测试活动',
        startTime:time.currentTime(),
        endTime:time.currentTime(),
        desc:  '这是一个测试',
        code: 'subscribe1433128294400'
    },
    user: {
        _id:'1234',
        openid:'oniQet-V-zTnLbMncUQpOgwjPAaI',
        displayName:'小贵子'
    }
};
exports.testSendRedCash = function(test){
    var campaignName, cashpack;
    MarketingCampaignService.loadByCodeAsync(mocks.campaign.code)
        .then(function(campaign){
            console.log(campaign.name);
            campaignName = campaign.name;
            cashpack = {
                campaign: campaign._id,
                minValue: 10,
                maxValue: 100,
                receiver: {
                    id: mocks.user._id,
                    openid: mocks.user.openid,
                    displayName: mocks.user.displayName
                }
            };
            cashpack['actualValue'] = function(){
                return this.minValue + parseInt((Math.random()* (this.maxValue - this.minValue)).toFixed(2), 10);
            }.call(cashpack);
            return MarketingCashPackService.createAsync(cashpack);
        })
        .then(function(cashpackdoc){
            console.log(cashpackdoc);
            cashpackdoc['campaignName'] = campaignName;
            return MarketingCashPackService.sendEnterprisePayAsync(cashpackdoc)
        })
        .then(function(result){
            console.log("send result is ------------- " + inspect(result));
            test.done();
            //logger.info('cashPack[id] ' + cashpack._id + ' is sended to user[openid]' + cashpack.openid);
        })
}
