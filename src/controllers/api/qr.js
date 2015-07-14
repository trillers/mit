var QrChannel = require('../../modules/qrchannel');
var util = require('util');
var logger = require('../../app/logging').logger;
var ApiReturn = require('../../framework/ApiReturn');

module.exports = function(router){
    require('../../app/routes-api')(router);
    //getTeacher QR CODE
    router.get('/getTeacherCode', function(req, res){
        var key = QrChannel.genKey(true, 'TS');
        var handler = QrChannel.handlers[key];
        handler.manualCreate(50, null, function(err, qr){
            //TODO err handler
            var url = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + qr.ticket;
            res.redirect(url);
        })
    });
};