var assert = require("assert");
var User = require('../../src/kvs/User');

describe('User', function(){
    var id = 'asdfasdfasdfdas';

    describe('#setFlagsByOpenid', function(){
        var flags = {};
        flags[User.flags.resignin] = "T";

        after(function(done){
            User.getFlagsByOpenid(id, function(err, result){
                assert.ok(!err);
                assert.equal(result.resignin, flags.resignin);
                done();
            });
        });

        it("set resignin flag", function(done){
            User.setFlagsByOpenid(id, flags, function(err){
                assert.ok(!err);
                done();
            });
        });
    });

    describe('#getFlagsByOpenid', function(){
        var flags = {};
        flags[User.flags.resignin] = "T";

        before(function(done){
            User.setFlagsByOpenid(id, flags, function(err){
                assert.ok(!err);
                done();
            });
        });

        it("get resignin flag", function(done){
            User.getFlagsByOpenid(id, function(err, result){
                assert.ok(!err);
                assert.equal(result.resignin, flags.resignin);
                done();
            });
        });
    });

    describe('#setFlagResigin and # getFlagResigin', function(){

        it("set and get resignin flag with true", function(done){
            var resignin = true;
            User.setFlagResignin(id, resignin, function(err){
                assert.ok(!err);
                User.getFlagResignin(id, function(err, result){
                    assert.ok(!err);
                    assert.equal(resignin, result);
                    done();
                });
            });
        });

        it("set and get resignin flag with true", function(done){
            var resignin = false;
            User.setFlagResignin(id, resignin, function(err){
                assert.ok(!err);
                User.getFlagResignin(id, function(err, result){
                    assert.ok(!err);
                    assert.equal(resignin, result);
                    done();
                });
            });
        });

    });

});