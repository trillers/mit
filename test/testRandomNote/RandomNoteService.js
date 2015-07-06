var logger = require('../../src/app/logging').logger;
var u = require('../../src/app/util');
var request = require('request');
var getAt = require('../../src/app/wechat/token').getAt;
var fs = require('fs');
var path = require('path');
var util = require('util');
var inspect = require('util').inspect;
var qn = require('qn');
var mocks = {
    serverid:'Ag6w9ZIz6mD4lzzUNOuKNkUvduReLRMY5EKfD6czHu-ddTigIZx56y2I3vel37tw'
};
var accessKey = 'Ulac7lEuDqiZ593owTOcQ0L8QieCC8D0tm6itYaU';
var secretKey = 'PohkfZBuxkAxLiIk6lMR39IdbPy6jpPM27jtEL03';

var url = "http://file.api.weixin.qq.com/cgi-bin/media/get?access_token=%s&media_id=%s";
exports.testSavePic = function(test){
    var client = qn.create({
        accessKey: 'Ulac7lEuDqiZ593owTOcQ0L8QieCC8D0tm6itYaU',
        secretKey: 'PohkfZBuxkAxLiIk6lMR39IdbPy6jpPM27jtEL03',
        bucket: 'china',
        domain: '7u2kxz.com2.z0.glb.qiniucdn.com'
    });
    var extendsutil = function(p,c){
        for(var prop in c){
            p[prop] = c[prop];
        }
    }
    clientproto = {
        MyimageInfo:function(filename,cb){
            return this._getMyImageInfo(filename,'imageInfo',cb);
        },
        MyimageExif:function(filename,cb){
            return this._getMyImageInfo(filename,'exif',cb);
        },
        _getMyImageInfo:function(filename,actiontype,cb){
            console.log("-----------"+actiontype);
            var url = "http://"+this.options.domain + '/' + filename + '?'+actiontype;
            request({
                method: 'get',
                url: url,
                json:true
            }, function (err, response, body) {
                console.log(err);
                cb(err,body);
            });
        }
    };
    extendsutil(client.__proto__,clientproto);
    //upload a Image
    getAt().then(function(at){
        url = util.format(url, at, mocks.serverid);

        var entryURI = "china";
        var encodedSrc = client.encodeEntryURI(url);
        var encodedDest = client.encodeEntryURI(entryURI);
        var req_url = "http://iovip.qbox.me" + "/fetch/" + encodedSrc + "/to/"
            + encodedDest;

        var signingStr = req_url+ "\n";
        var sign = client.signData(signingStr, secretKey);
        var encodedSign = client.encodeEntryURI(sign);
        var accessToken = accessKey + ":" + encodedSign;

        request({
            headers: {
                'content-type': "application/x-www-form-urlencoded",
                'authorization': 'QBox '+ accessToken
            },
            method: 'get',
            url: req_url,
            encoding:null
        }, function (err, response, body) {
            //client.upload(new Buffer(body), {key: 'user/mytest15.jpg'}, function (err, result) {
            //    console.log(err);
            //    console.log(result);
            //});
            console.log('statusCode ' + response);
            test.done();
        });
    }).then(function(){
        //get Image Info
        client.MyimageInfo('user/mytest14.jpg',function (err, info) {
            console.log(info);
        });

    }).then(function(){
        //get Image Exif
        client.MyimageExif('user/mytest14.jpg', function (err, info) {
            console.log(info);
        });
    }).catch(Error, function(e){
        console.log(e.message);
    });
}

