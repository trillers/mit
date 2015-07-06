var assert = require("assert");
var ImageService = require("../../src/services/ImageService");
var UserService = require("../../src/services/UserService");

describe('ImageService', function(){
    describe('#create()', function(){
        var creator = null;
        var newImage = null;
        var loadedImage = null;
        var newImageJson = {
            url: 'http://7u2kxz.com1.z0.glb.clouddn.com/QQ截图20150213105409.png" data-original="http://7u2kxz.com1.z0.glb.clouddn.com/QQ截图20150213105409.png',
            bkt: 'pa',
            name: 'guilin',
            ext: 'png',
            mediaId: 'abc',
            meta: {
                height: 600,
                height: 600,
                size: 100000,
                tone: 'cold'
            }
        };

        before(function(done){
            setTimeout(function(){
                done();
            },200)
        });

        //Prepare initiator
        before(function(done){
            UserService.createAnonymously(function(err, user){
                creator = user;
                assert.ok(!err);
                assert.ok(user);
                done();
            });
        });

        it("create an image with full info", function(done){
            ImageService.create(newImageJson,  function(err, image){
                assert.ok(!err);
                assert.ok(image);
                newImage = image;
                done();
            });
        });

    });

});