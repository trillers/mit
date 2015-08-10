var assert = require("assert");
var cskv = require('../kvs/CustomerServer');

describe('CustomerServer', function(){
    var id = 'ABC7', openId = '4x88adf888dddd88dd', css = {csId: id, expire: '44444'};


    it('delCSStatusById', function(done){
        cskv.delCSStatusById(id, function(err, data){
            console.log(data);
            assert.ok(!err);
            assert.equal(data, 1);
            done();
        });
    });

    it('saveCSStatusById', function(done){
        cskv.saveCSStatusById(id, 'ol', function(err, data){
            console.log(data);
            assert.ok(!err);
            assert.equal(data, 'ol');
            done();
        });
    });

    it('loadCSStatusById', function(done){
        cskv.loadCSStatusById(id, function(err, data){
            console.log(data);
            assert.ok(!err);
            assert.equal(data, 'ol');
            done();
        });
    });

    it('delCSSByOpenId', function(done){
        cskv.delCSSByOpenId(openId, function(err, data){
            console.log(data);
            assert.ok(!err);
            assert.equal(data, 1);
            done();
        });
    });

    it('saveCSSByOpenId', function(done){
        cskv.saveCSSByOpenId(openId, css, function(err, data){
            console.log(data);
            assert.ok(!err);
            assert.equal(data, css);
            done();
        });
    });

    it('loadCSSByOpenId', function(done){
        cskv.loadCSSByOpenId(openId, function(err, data){
            console.log(data);
            assert.ok(!err);
            assert.equal(data.csId, css.csId);
            assert.equal(data.expire, css.expire);
            done();
        });
    });

    it('delCSHandingSetById', function(done){
        cskv.delCSHandingSetById(id, function(err, data){
            console.log(data);
            assert.ok(!err);
            assert.equal(data, 1);
            done();
        });
    });

    it('pushCSHandingSetById', function(done){
        cskv.pushCSHandingSetById(id, openId, function(err, data){
            console.log(data);
            assert.ok(!err);
            assert.equal(data, openId);
            done();
        });
    });

    it('loadCSHandingSetById', function(done){
        cskv.loadCSHandingSetById(id, function(err, data){
            console.log(data);
            assert.ok(!err);
            assert.equal(data[0], openId);
            done();
        });
    });

    it('pushCSHandingSetById ddd', function(done){
        cskv.pushCSHandingSetById(id, 'ddd', function(err, data){
            console.log(data);
            assert.ok(!err);
            assert.equal(data, 'ddd');
            done();
        });
    });

    it('popCSHandingSetById', function(done){
        cskv.popCSHandingSetById(id, openId, function(err, data){
            console.log(data);
            assert.ok(!err);
            assert.equal(data, openId);
            done();
        });
    });

    it('delCSLoadById', function(done){
        cskv.delCSLoadById(id, function(err, data){
            console.log(data);
            assert.ok(!err);
            assert.equal(data, id);
            done();
        });
    });

    it('setCSLoadById', function(done){
        cskv.setCSLoadById(id, 0, function(err, data){
            console.log(data);
            assert.ok(!err);
            assert.equal(data, id);
            done();
        });
    });

    it('loadCSLoad', function(done){
        cskv.loadCSLoad(function(err, data){
            console.log(data);
            assert.ok(!err);
            assert.equal(data[id], 0);
            done();
        });
    });

    it('modifyCSLoadById plus one', function(done){
        cskv.modifyCSLoadById(id, 1, function(err, data){
            console.log(data);
            assert.ok(!err);
            assert.equal(data, 1);
            done();
        });
    });

    it('modifyCSLoadById reduce one', function(done){
        cskv.modifyCSLoadById(id, -1, function(err, data){
            console.log(data);
            assert.ok(!err);
            assert.equal(data, 0);
            done();
        });
    });

});