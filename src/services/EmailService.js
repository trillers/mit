//var nodemailer = require('nodemailer');
//var settings = require('mit-settings');
//var path = require('path');
//var Service = {};
//
//var transporter = nodemailer.createTransport({
//    host: settings.smtp.host,
//    port: settings.smtp.port,
//    auth:{
//        user: settings.smtp.username,
//        pass: settings.smtp.password
//    }
//});
//
//var mailOptions = {
//    from: settings.smtp.from // sender address
//};
//
//
//Service.send = function(to, subject, template, cb){
//    mailOptions.to = to;
//    mailOptions.subject = subject;
//    mailOptions.html = template;
//    mailOptions.attachments = [
//        {
//            filename: 'qrCode.png',
//            path: path.join(__dirname, '../../web/images/qrCode.png'),
//            cid: '00000001'
//        }
//    ];
//    transporter.sendMail(mailOptions, function(err, info){
//        if(err){
//            console.log(err);
//            if(cb) cb(err);
//        }else{
//            console.log('Message sent: ' + info.response);
//            if(cb) cb(null, "send email success!");
//        }
//    });
//}
//
//module.exports = Service;
