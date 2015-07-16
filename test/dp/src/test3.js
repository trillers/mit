var wechatApi = require('../../../src/app/wechat/api');
console.log(1)
var tutorMediaId = "9Qx2NY4keMALv37HdZ-XfJjCsNWy1w5l3Kmar0zJc2DBtBb1fFRa_nRUv57RFv4P";
wechatApi.api.sendImage('okvXqswFmgRwEV0YrJ-h5YvKhdUk', tutorMediaId, function(err, result){
    if(err){
        console.log(err)

    }else{
        console.log(result)

    }
});