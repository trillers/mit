var settings = require('mit-settings');
var time = require('../app/time');
var fs = require('fs');
var cashPackTemplate = {
    mch_id: settings.wechat.mchId,
    //pfx: fs.readFileSync(settings.wechat.wxpayCert),
    wxappid: settings.wechat.appKey,
    send_name: '快乐种子',
    nick_name: '快乐种子送你红包!',
    wishing: '感谢关注，红包送上！',
    remark: '来快乐种子,找寻属于你的快乐',
    client_ip: '182.92.159.47',
    total_num: 1,
    partner_key: settings.wechat.partnerKey
}
function _getCurrentTime(){
    return time.format(time.currentTime(), 'yyyyMMdd');
}
function _generatorRandomStr(num){
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var maxPos = chars.length;
    var noceStr = "";
    for (var i = 0; i < num; i++) {
        noceStr += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return noceStr;
}
function _generateActualNum(min, max){
    return min + parseInt((Math.random()* (max - min)).toFixed(2), 10);
}
function _mixin(){
    var args = [].slice.call(arguments);
    var target =args[0];
    var sources = args.slice(1);
    for(var i=0, len = sources.length; i<len; i++){
        for(var prop in sources[i]){
            target[prop] = sources[i][prop];
        }
    }
    return target;
}

var getCashPackInstance = function(cashpack){
    var cashPackObj = {};
    _mixin(cashPackObj, cashPackTemplate);
    cashPackObj['mch_billno'] = settings.wechat.mchId + _getCurrentTime() + _generatorRandomStr(10);
    cashPackObj['total_amount'] = cashpack.actualValue;
    return cashPackObj;
}
module.exports = getCashPackInstance;

