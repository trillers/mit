var assert = require("assert");
var UserService = require('../../src/services/UserService');

describe('UserService', function(){
    describe('loadOrCreateFromWechat', function(){
        before(function(done){
            done();
        });

        var openid = 'oqSpUuDlnKxHxwZa4xylKuyxaXNM'; //包三哥测试账号
        it("load by my id", function(done){
            UserService.loadOrCreateFromWechat(openid, function(err, userInfo){
                console.error(err);
                assert.ok(!err);
                console.log(userInfo);
                done();
            });
        });

    });

});