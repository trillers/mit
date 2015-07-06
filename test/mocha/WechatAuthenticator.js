var assert = require("assert");
var WechatAuthenticator = require('../../src/framework/WechatAuthenticator');

describe('WechatAuthenticator', function(){
    describe('ensureSignin', function(){
        before(function(done){
            done();
        });

        var openid = 'oqSpUuDlnKxHxwZa4xylKuyxaXNM'; //包三哥测试账号
        var authenticator = new WechatAuthenticator({});
        it("load or create", function(done){
            authenticator.ensureSignin({FromUserName: openid},
                {}, //req
                {}, //res
                function () { //next
                },
                function (user) {
                    console.log(user);
                    done();
                }
            );
        });

    });

});