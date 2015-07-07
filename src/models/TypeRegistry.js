var TypeRegistry = require('../framework/model/TypeRegistry');
var registry = new TypeRegistry('TypeRegistry', 'TypeRegistry', 'TypeRegistry');

registry
.item('LifeFlag', 'LifeFlag', '状态')
    .addChild('Active','a', '活动')
    .addChild('Inactive','i', '锁定')
    .addChild('Deleted','d', '已删除')
.up().item('UserType', 'UserType', '用户类型')
    .addChild('Local','l', '本地')
    .addChild('OAuth','o', '通行证')
.up().item('ChargeType', 'ChargeType', '费用类型')
    .addChild('Free','f', '免费')
    .addChild('Pay','p', '付费')
.up().item('ProductActivityStatus', 'ProductActivityStatus', '活动状态')
    .addChild('Draft','d', '草稿')
    .addChild('Reviewing','r', '审核中')
    .addChild('Applying','a', '报名中')
    .addChild('Ready','re', '即将开始')
    .addChild('Acting','ac', '进行中')
    .addChild('Completed','co', '已结束')
    .addChild('Cancelled','ca', '已取消')
.up().item('ReviewStatus', 'ReviewStatus', '审核状态')
    .addChild('ToReview','t', '待审核')
    .addChild('Approved','d', '通过')
    .addChild('Rejected','r', '驳回')
.up().item('TypeTags', 'TypeTags', '类型标签')
    .addChild('CampusActivities', 'ca', '校园活动')
    .addChild('FamilyActivities', 'fa', '亲子少儿')
    .addChild('Chair', 'ch', '讲座')
    .addChild('Travel', 'tr', '出游')
    .addChild('OutdoorFitness', 'of', '体育户外')
    .addChild('Party', 'pt', '聚会派对')
    .addChild('TeamBuilding', 'tb', '团队建设')
    .addChild('OtherActivities', 'oa', '其他活动')
    .addChild('TourNearby', 'tn', '周边游')
    .addChild('Exhibition', 'ex', '展会展览')
.up().item('CashPackStatus', 'CashPackStatus', '红包状态')
    .addChild('Created', 'c', '已创建')
    .addChild('Sent', 's', '已发送')
    .addChild('Received', 'r', '已收到')
.up().item('MarketingCampaignStrategy', 'MarketingCampaignStrategy', '营销策略')
    .addChild('FirstSubscribe', 'fs', '首次关注')
    .addChild('ShareMc', 'sm', '分享活动')
    .addChild('UserFlow', 'uf', '用户引流')



module.exports = registry;