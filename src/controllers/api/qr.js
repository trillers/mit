var QrCodeService = require('../../modules/qrChannel/services/QrChannelService');
var util = require('util');
var logger = require('../../app/logging').logger;
var ApiReturn = require('../../framework/ApiReturn');

module.exports = function(router){
    require('../../app/routes-api')(router);

    //getTeacher QR CODE
    router.get('/getTeacherCode', function(req, res){
        QrCodeService.loadBySceneId(50, function(err, qr){
            if(err){
                logger.err('get teacher code err: ' + err);
                return res.send('error sceneId');
            }
            var url = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=';
            if(qr){
                url += qr.ticket;
                return res.redirect(url);
            }else{
                QrCodeService.createTeacherQrCode(true, 'TS', 50, null, function(err, qr){
                    //todo err handler
                    url += qr.ticket;
                    return res.redirect(url);
                });
            }
        })
    });

};