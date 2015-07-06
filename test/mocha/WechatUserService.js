var assert = require("assert");
var UserService = require('../../src/services/UserService');
var WechatUserService = require('../../src/services/WechatUserService');

describe('WechatUserService', function(){
    describe('#createOrUpdateFromWechatOauth', function(){
        var openid = 'oqSpUuDlnKxHxwZa4xylKuyxaXNM'; //包三哥测试账号
        var oauth = {
            openid: openid,
            access_token: 'test access token',
            refresh_token: 'test access token',
            scope: 'sns_base'
        };
        before(function(done){
            UserService.deleteByOpenid(openid, function(err, user){
                assert.ok(!err);
                done();
            });
        });

        it("create a brand new user by openid", function(done){
            WechatUserService.createOrUpdateFromWechatOAuth(oauth, function(err, userInfo){
                console.error(err);
                assert.ok(!err);
                console.log(userInfo);
                done();
            });
        });

        it("update an existed user by my openid", function(done){
            WechatUserService.createOrUpdateFromWechatOAuth(oauth, function(err, userInfo){
                console.error(err);
                assert.ok(!err);
                console.log(userInfo);
                done();
            });
        });

    });

});