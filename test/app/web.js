var assert = require("assert");
var WebHelper = require('../../src/app/web');
var settings = require('mit-settings');

describe('WebHelper', function(){

    describe('#getBaseUrl()', function(){
        it("get base url with port: 80", function(done){
            var app = {
                protocol: 'http',
                    host: '127.0.0.1',
                    port: 3020,
                    domain: 'dev.www.zz365.com.cn',
                    domainPort: 80,
                    context: '/'
            };
            var baseUrl = WebHelper.getBaseUrl(app);
            assert.equal(baseUrl, 'http://dev.www.zz365.com.cn');
            done();
        });

        it("get base url with port: 8000", function(done){
            var app = {
                protocol: 'http',
                host: '127.0.0.1',
                port: 3020,
                domain: 'dev.www.zz365.com.cn',
                domainPort: 8000,
                context: '/'
            };
            var baseUrl = WebHelper.getBaseUrl(app);
            assert.equal(baseUrl, 'http://dev.www.zz365.com.cn:8000');
            done();
        });

    });

    describe('#getUrl()', function(){
        it("get url with port: 80", function(done){
            var app = {
                protocol: 'http',
                host: '127.0.0.1',
                port: 3020,
                domain: 'dev.www.zz365.com.cn',
                domainPort: 80,
                context: '/'
            };
            var url = WebHelper.getUrl(app);
            assert.equal(url, 'http://dev.www.zz365.com.cn/');
            done();
        });

        it("get url with port: 8000", function(done){
            var app = {
                protocol: 'http',
                host: '127.0.0.1',
                port: 3020,
                domain: 'dev.www.zz365.com.cn',
                domainPort: 8000,
                context: '/'
            };
            var url = WebHelper.getUrl(app);
            assert.equal(url, 'http://dev.www.zz365.com.cn:8000/');
            done();
        });

        it("get url with port: 8000 context: /mp", function(done){
            var app = {
                protocol: 'http',
                host: '127.0.0.1',
                port: 3020,
                domain: 'dev.www.zz365.com.cn',
                domainPort: 8000,
                context: '/mp'
            };
            var url = WebHelper.getUrl(app);
            assert.equal(url, 'http://dev.www.zz365.com.cn:8000/mp');
            done();
        });

    });

});