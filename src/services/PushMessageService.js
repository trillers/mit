var util = require('util'),
    time = require('../app/time'),
    wechat = require('../app/wechat/api'),
    Service = {},
    settings = require('mit-settings'),
    url = {};

url.conf = {
    'development': 'http://ci.www.zz365.com.cn/#activity/_',
    'production': 'http://www.zz365.com.cn/#activity/_'
};

var pushType = {
    applicantRemind:{
        pushdata :{
            template : 'RIXAruElWsvI9Sq0P1tcPrsZJbxGV82n-_ASmBiRE9U',
            topcolor : '#FF0000'
        },
        builddata:function(doc){
            var data, openid, paid;
            var pa = doc.padoc, popdoc = doc.popeddoc[doc.popeddoc.length-1];
            paid = pa._id;
            var reurl = url.conf[settings.env.mode] + paid;
            //openid = doc.popdoc.applicant.openid;
            openid = "oqSpUuJR2MjzH3Iy2TEkx5MkJ7hE";
            data = {
                first : {
                    "value": "hi！你发起的活动刚刚有小伙伴报名啦，请尽快确认报名人信息。",
                    "color": "#173177"
                },
                activityName: {
                    "value": pa.name,
                    "color": "#173177"
                },
                applicantName: {
                    "value": popdoc.displayName || popdoc.applicant.displayName || "",
                    "color": "#173177"
                },
                num: {
                    "value": popdoc.num,
                    "color": "#173177"
                },
                remark: {
                    "value": time.currentTime(),
                    "color": "#173177"
                }
            };
            return {data:data, openid: openid, url: reurl};
        }
    },

    commentRemind :{
        pushdata :{
            template : 'N7lwQETLTDyujUmuMM9n_sr5zvbnTH-Kk2gqKE9qqz8',
            topcolor : '#FF0000'
        },
        builddata:function(doc){
            var data, openid, paid;
            var paname = doc.paname, comment = doc.comment;
            paid = doc.paid;
            var reurl = url.conf[settings.env.mode] + paid;
            //openid = doc.openid;
            openid = "oniQet-PfAlF63MjN46hq74Vww8I";
            data = {
                first : {
                    "value": "hi！你发起的活动刚刚有小伙伴报名啦，请尽快确认报名人信息。",
                    "color": "#173177"
                },
                activityName: {
                    "value": pa.name,
                    "color": "#173177"
                },
                applicantName: {
                    "value": popdoc.displayName || popdoc.applicant.displayName || "",
                    "color": "#173177"
                },
                num: {
                    "value": popdoc.num,
                    "color": "#173177"
                },
                remark: {
                    "value": time.currentTime(),
                    "color": "#173177"
                }
            };
            return {data:data, openid: openid, url: reurl};
        }
    },

    replyRemind: {
        pushdata :{
            template : 'N7lwQETLTDyujUmuMM9n_sr5zvbnTH-Kk2gqKE9qqz8',
            topcolor : '#FF0000'
        },
        builddata:function(doc){
            var data, openid, paid;
            var paname = doc.paname, comment = doc.comment;
            paid = doc.paid;
            var reurl = url.conf[settings.env.mode] + paid;
            //openid = doc.openid;
            openid = "oniQet-PfAlF63MjN46hq74Vww8I";
            data = {
                name:{
                    "value": comment && comment.replyTo.displayName || comment.commenter.displayName || "",
                    "color": "#173177"
                },
                Time:{
                    "value": time.currentTime(),
                    "color": "#173177"
                },
                remark:{
                    "value": paname || "您发起的活动",
                    "color": "#173177"
                }
            };
            return {data:data, openid: openid, url: reurl};
        }
    },

    registry:function(doc){
        var odata = this[doc.type].builddata(doc);
        var pushdata = this[doc.type]['pushdata'];
        var result = {
            template: pushdata.template,
            topcolor: pushdata.topcolor,
            data: odata.data,
            openid: odata.openid,
            url: odata.url
        }
        return result;
    }
};

Service.pushApplicationMessage = function (doc, cb) {
    var data = pushType.registry(doc);
    if( typeof data.openid != "undefined" ){
        wechat.api.sendTemplate(data.openid, data.template, data.url, data.topcolor, data.data, function(err, result){
            if(err){
                return cb(err);
            }else{
                return cb(null);
            }
        })
    }else{
        return cb(null);
    }
};
module.exports = Service;
