var mongoose = require('../app/mongoose');
var logger = require('../app/logging').logger;
var DomainBuilder = require('../framework/model/DomainBuilder');
var Application = require('./ProductActivityApplication').schema;
var Comment = require('./Comment').schema;
var RandomNote = require('./RandomNote').schema;
var typeRegistry = require('./TypeRegistry');
var workflowRegistry = require('../app/workflow');

var ChargeType = typeRegistry.item('ChargeType');
var ProductActivityStatus = typeRegistry.item('ProductActivityStatus');
var ReviewStatus = typeRegistry.item('ReviewStatus');
var TypeTags = typeRegistry.item('TypeTags');


var ApplicationFieldSchema = DomainBuilder
    .i('ProductActivityApplicationField')
    .withBasis()
    .withProperties({

        "type": {type: String, required: true} //字段类型

        , "name": {type: String, required: true} //字段程序名称

        , "title": {type: String, required: true} //字段页面显示名称

        , "required": {type: Boolean, required: true} //字段是否必填

    })
    .build();

var schema = DomainBuilder
    .i('ProductActivity')
    .withBasis()
    .withLifeFlag()
    .withCreatedOn()
    .withCreatedBy()
    .withUpdatedOn()
    .withUpdatedBy()
    .withRank()
    .withProperties({

        "status": {type: String, enum: ProductActivityStatus.valueList(), default: ProductActivityStatus.Draft.value(), required: true} //活动状态

        , "reviewStatus": {type: String, enum: ReviewStatus.valueList(), default: ReviewStatus.ToReview.value(), required: true} //审核状态

        , "name": {type: String, required: true} //活动名称

        , "pics": [String] //活动海报图片, 可多张，目前页面只允许放一张，以后可以放开

        , "images": [{
            id: {type: String, ref: 'Image', required: true}
            , url: {type: String} //url in image cloud
            , mediaId: {type: String} //wechat media id
            , meta: {type: String} //width+height+size+tone(色调)
            , name: {type: String} //filename
        }] //活动海报图片, 可多张，目前页面只允许放一张，以后可以放开

        , "place": {type: String, required: true} //地点

        , "startTime": {type: Date, required: true} //开始日期

        , "endTime": {type: Date, required: true} //结束日期

        , "closingTime": {type: Date, required: true} //报名截止日期

        , "initiator": {type: String, ref: 'User', default: null, required: false} //发起人姓名

        , "initiatorMail": {type: String, default: null, required: false}

        , "initiatorName": {type: String, required: false} //发起人姓名

        , "initiatorContact": {type: String, required: false} //发起人联系方式

        , "desc": {type: String, required: false} //活动介绍

        , "statusrank": {type: Number, required: false}

        , "privateFlag": {type: Boolean, required: false, default: false} //私有活动
/*
        , "promotion": {type: String, required: false} //活动宣传词（活动介绍：活动目的是什么、有什么亮点）

        , "chargeType": {type: String, enum: ChargeType.valueList(), default: ChargeType.Free.value(), required: true} //活动费用类型（免费、付费）

        , "chargeDesc": {type: String, required: false} //费用说明

        , "applicationLimit": {type: Number, default: -1, required: false} //活动限额人数: -1: 不限, 默认，其他取值范围：正整数

        , "applicationDesc": {type: String, required: false} //报名方式说明

        , "scheduleDesc": {type: String, required: false} //活动日程

        , "otherDesc": {type: String, required: false} //其他详情（活动交通方式、集合地点时间、装备要求等）
*/

        , "applicationFields": [ApplicationFieldSchema] //活动申请模型自定义字段数组

        , "applications": [Application] //申请记录列表

        , "comments": [Comment]

        , "randomNotes": [RandomNote]

        , "tags": {
            "region": { type: String, default: ''},
            "type": { type: Array, enum: TypeTags.valueList()},
            "custom": { type: String}
        }

        ,"priorityRank": { type: Number, default: 0 }

        ,"introImgs": [{
            id: {type: String, ref: 'Image', required: true}
            , url: {type: String} //url in image cloud
            , localId: {type: String}
            , mediaId: {type: String} //wechat media id
            , meta: {type: String} //width+height+size+tone(色调)
            , name: {type: String} //filename
        }]

        , "meta": {
            "views": { type: Number, default: 0 }, // 查看人数
            "likes": { type: Number, default: 0 }, // 喜欢数
            "stars": { type: Number, default: 0 }, // 收藏数
            "apps": { type: Number, default: 0 }  // 报名人总数
        }
        , "tenantId": {type: String, required: false, ref: 'Tenant'}
    })
    .build();

    //TODO: use batch synchronization with redis by sub/pub mechanism
    var metaAction = function (prop, incOp) {
        var metaProp = 'meta.'+prop;
        var update = { $inc: {}};
        update.$inc[metaProp] = incOp ? 1 : -1;
        return function (thingId, uid, callback){
            this.findByIdAndUpdate(//TODO: update it directly use update operation
                thingId,
                update,
                {select:[metaProp]},
                function(err, thing){
                    if(err){
                        logger.error(err);
                        callback(err);
                        return;
                    }
                    logger.debug(thing);
                    if(thing){
                        thing.meta = thing.meta || {};
                        callback(null, thing.meta[prop]);
                    }
                    else{
                        callback(null, 0);
                    }
                }
            );
        }
    };
    var rankmap = {
        'd' : 10,
        'r' : 20,
        'a' : 30,
        're' : 40,
        'ac' : 50,
        'co' : 60,
        'ca' :70
    }
    schema.static('like', metaAction('likes', true));
    schema.static('unlike', metaAction('likes', false));
    schema.static('star', metaAction('stars', true));
    schema.static('unstar', metaAction('stars', false));
    schema.pre('save', function (next) {
        if(this.get('status')){
            this.set('statusrank', rankmap[this.get('status')]);
        }else{
            try{
                logger.info("currentTime is----------" + (new Date()));
                logger.info("currentAc is----------" + (this.get('_id')));
                logger.error("the status is missed----------");
            }catch(err){
                logger.error("the status is missed----------" + require('util').inspect(err));
            }
        }
        next();
    });
    schema.pre('update', function (next) {
        try{
            logger.info("the statusrankupdate is begin----------");
            if(this.get('status')){
                logger.info("the statusrankupdate is existed----------" + require('util').inspect(this.get('status')));
                this.set('statusrank', rankmap[this.get('status')]);
            }else{
                try{
                    logger.info("currentTime is----------" + (new Date()));
                    logger.info("currentAc is----------" + (this.get('_id')));
                    logger.error("the status is missed----------");
                }catch(err){
                    logger.error("the status is missed twice----------" + err);
                }
            }
        }catch(err){
            logger.error("the statusrank is missed----------" + require('util').inspect(err));
        }
        logger.info("the statusrankupdate is end----------");
        next();
    });
var paWorkflow = workflowRegistry.workflow('ProductActivity');
var paActions = {
    'publish': 'publish',
    'approve': 'approve',
    'reject': 'reject',
    'stopApply': 'stopApply',
    'recall': 'recall',
    'act': 'act',
    'complete': 'complete',
    'cancel': 'cancel'
};

paWorkflow.define({
    initial: ProductActivityStatus.Draft.name(),
    transitions: [
        {action: paActions.publish, from: ProductActivityStatus.Draft.name(), to: ProductActivityStatus.Reviewing.name()},
        {action: paActions.approve, from: ProductActivityStatus.Reviewing.name(), to: ProductActivityStatus.Applying.name()},
        {action: paActions.reject, from: ProductActivityStatus.Reviewing.name(), to: ProductActivityStatus.Draft.name()},
        {action: paActions.act, from: ProductActivityStatus.Applying.name(), to: ProductActivityStatus.Acting.name()},
        {action: paActions.act, from: ProductActivityStatus.Ready.name(), to: ProductActivityStatus.Acting.name()},
        {action: paActions.stopApply, from: ProductActivityStatus.Applying.name(), to: ProductActivityStatus.Ready.name()},
        {action: paActions.recall, from: ProductActivityStatus.Applying.name(), to: ProductActivityStatus.Draft.name()},
        {action: paActions.complete, from: ProductActivityStatus.Acting.name(), to: ProductActivityStatus.Completed.name()},
        {action: paActions.cancel, from: ProductActivityStatus.Applying.name(), to: ProductActivityStatus.Cancelled.name()}
    ]
});


var reviewWorkflow = workflowRegistry.workflow('ActivityReview');
var reviewActions = {
    'approve': 'approve',
    'reject': 'reject'
};
reviewWorkflow.define({
    initial: ReviewStatus.ToReview.name(),
    transitions: [
        {action: reviewActions.approve, from: ReviewStatus.ToReview.name(), to: ReviewStatus.Approved.name()},
        {action: reviewActions.approve, from: ReviewStatus.Rejected.name(), to: ReviewStatus.Approved.name()},
        {action: reviewActions.reject, from: ReviewStatus.ToReview.name(), to: ReviewStatus.Rejected.name()},
        {action: reviewActions.reject, from: ReviewStatus.Approved.name(), to: ReviewStatus.Rejected.name()}
    ]
});




module.exports.schema = schema;
module.exports.model = schema.model(true);
module.exports.workflow = paWorkflow;
module.exports.actions = paActions;
module.exports.statusrankmap = rankmap;

module.exports.workflows = {
    ProductActivity: paWorkflow,
    ActivityReview: reviewWorkflow
};


