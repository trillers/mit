var express = require('express');
var wechatApi = require('../../../src/app/wechat/api');
var tutorMediaId = "9Qx2NY4keMALv37HdZ-XfJjCsNWy1w5l3Kmar0zJc2DBtBb1fFRa_nRUv57RFv4P";
var anguiOpenId = "okvXqs4vtB5JDwtb8Gd6Rj26W6mE"
module.exports = function(){
    var router = express.Router({strict: true});
    router.get('/sendQr', function(req, res){
        wechatApi.api.sendImage(anguiOpenId, tutorMediaId, function(err, result){
            if(err){
                console.log(err)

            }else{
                console.log("send succeed---------------");
                console.log(result)

            }
        });
    })
    return router;
}