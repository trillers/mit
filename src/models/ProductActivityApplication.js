var mongoose = require('../app/mongoose');
var DomainBuilder = require('../framework/model/DomainBuilder');

var schema = DomainBuilder
    .i('ProductActivityApplication')
    .withBasis()
    .withLifeFlag()
    .withCreatedOn()
    .withUpdatedOn()
    .withUpdatedBy()
    .withRank()
    .withProperties({

        "displayName": {type: String, required: true} //申请人昵称

        , "phone": {type: String, required: true} //申请人联系电话

        , "gender": {type: String, required: false} //申请人性别 0:男 1:女

        , "birthday": {type: Date, required: false} //申请人出生日期

        , "IDCard": {type: String, required: false} //申请人身份证号

        , "company": {type: String, required: false} //申请人单位

        , "position": {type: String, required: false} //申请人职位

        , "business": {type: String, required: false} //申请人行业

        , "school": {type: String, required: false} //申请人学校

        , "class": {type: String, required: false} //申请人班级

        , "discipline": {type: String, required: false} //申请人专业

        , "applicant": {type: String, ref: 'User', default: null, required: true} //申请人用户ID, 可以population成为用户对象

        , "num": {type: Number, default: 1, required: true} //报名人数: 默认是1，值域1 - 总活动人数上限

        , "desc": {type: String, required: false} //备注

    })
    .build();

module.exports.schema = schema;
module.exports.model = schema.model(true);