var logger = require('./logging').logger;
var u = require('./util');
var request = require('request');
var getAt = require('./wechat/token').getAt;
var util = require('util');
var inspect = require('util').inspect;
var qn = require('qn');
var weixinmediaurl_template = "http://file.api.weixin.qq.com/cgi-bin/media/get?access_token=%s&media_id=%s";
var options = {
    accessKey: 'Ulac7lEuDqiZ593owTOcQ0L8QieCC8D0tm6itYaU',
    secretKey: 'PohkfZBuxkAxLiIk6lMR39IdbPy6jpPM27jtEL03',
    bucket: 'china',
    domain: '7u2kxz.com2.z0.glb.qiniucdn.com'
};
var client = qn.create(options);
var extendsutil = function(p,c){
    for(var prop in c){
        p[prop] = c[prop];
    }
}
var clientproto = {
    MyimageInfo:function(filename,cb){
        return this._getMyImageInfo(filename,'imageInfo',cb);
    },
    MyimageExif:function(filename,cb){
        return this._getMyImageInfo(filename,'exif',cb);
    },
    _getMyImageInfo:function(imgopts,actiontype,cb){
        var input = "";
        imgopts && imgopts.uri && (input = "http://" + this.options.domain + '/' + imgopts.uri) || imgopts.url && (input = 'http://'+imgopts.url)
        var url = input + '?'+actiontype;
        request({
            method: 'get',
            url: url,
            json:true
        }, function (err, response, body) {
            console.log(err);
            cb(err,body);
        });
    },
    saveImageByServerId:function(at,serverid,filename,cb){
        var weixinmediaurl = util.format(weixinmediaurl_template, at, serverid);
        request({
            method: 'get',
            url: weixinmediaurl,
            encoding:null
        }, function (err, response, body) {
            //TODO
            if(err){
                console.error(err);
                cb(err);
                return;
            }
            //else if(JSON.parse(body).errmsg){
            //    var body = JSON.parse(body);
            //    var error = new Error(body.errmsg);
            //    error.code = body.errcode;
            //    cb(error);
            //    return;
            //}
            client.upload(new Buffer(body), {key: filename}, function (err, result) {
                console.log("error--------"+err);
                console.log(result);
                cb(err,result);
            });
        });
    }
};
extendsutil(client.__proto__,clientproto);
module.exports = client;


