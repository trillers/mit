var assert = require("assert");
var EmailService = require('../../src/services/EmailService');

describe('EmailService', function(){
    describe('Send Email', function(){
        it("start send email", function(done){
            EmailService.send('test@qq.com', 'test send email', '<a href="http://www.baidu.com">百度</a>', function(err, result){
                assert.ok(!err);
                assert.equal(result, 'send email success!');
                done();
            });
        });

    });

});
