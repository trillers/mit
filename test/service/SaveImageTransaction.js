var assert = require("assert");
var ImageService = require("../../src/services/ImageService");
var ProductActivityService = require("../../src/services/ProductActivityService");
var qnService = require("../../src/app/qn");
var getAt = require('../../src/app/wechat/token').getAt;
var inspect = require('util').inspect;
var Promise = require('bluebird');
var imgHandleTrigger = require('../../src/app/imghandletrigger').imgHandlerTrigger;
var events = require('events')
//prepare the mocks
var mock = {
    image: {
        _id: "5508e6b229999b60128fb9f9",
        url: 'http://7u2kxz.com1.z0.glb.clouddn.com/QQ截图20150213105409.png" data-original="http://7u2kxz.com1.z0.glb.clouddn.com/QQ截图20150213105409.png',
        bkt: 'pa',
        name: 'guilin',
        ext: 'png',
        mediaId: 'Ag6w9ZIz6mD4lzzUNOuKNkUvduReLRMY5EKfD6czHu-ddTigIZx56y2I3vel37tw',
        meta: {
            height: 600,
            height: 600,
            size: 100000,
            tone: 'cold'
        }
    },
    pa:
    {
        "rank": 107600000,
        "updOn": "2015-03-19T17:14:00.201Z",
        "crtOn": "2015-03-19T17:14:00.200Z",
        "lFlg": "a",
        "name": "111",
        "startTime": "2015-03-20T00:00:00.0Z",
        "endTime": "2015-03-20T00:00:00.0Z",
        "place": "222",
        "initiatorName": "877",
        "initiatorContact": "999",
        "closingTime": "2015-03-20T00:00:00.0Z",
        "desc": "【活动说明】\n【活动日程】\n【费用说明】自行消费\n【集合时间】\n【集合地点】\n【交通方式】\n【报名说明】\n1、直接系统报名，报名名单中显示用户名字即报名成功；\n2、本活动不限名额。/本活动限x人，以报名先后确认名额。\n【温馨提示】\n1、\n2、",
        "updBy": null,
        "crtBy": null,
        "meta": {
            "likes":0,
            "views": 0
        },
        "tags": {
            "region": ""
        },
        "comments": [

        ],
        "applications": [

        ],
        "initiator": "Bw5nk",
        "images": [
            {
                "id": "550b03d811ca996a5ba7951b",
                "mediaId": "GiVWOq7O4jm0kNe8t8dl0qeF96XYcnTpJX6-Z2G8NAXazZpMsygJ1CVvjKqZLfWq",
                "_id": "550b03d811ca996a5ba7951c"
            }
        ],
        "pics": [
            "/public/images/pabanner.png"
        ],
        "status": "d",
        "_dv": 0
    }

};


//var ImageServicePro = Promise.promisifyAll(ImageService);
//var qnServicePro = Promise.promisifyAll(qnService);
//var mediaId = "";
describe('qnService', function() {
    it("the transaction of save image to qn and update the doc", function (done) {
        var pa = mock.pa;
        console.log(pa.images[0]);
        if(pa && pa.images && pa.images[0] &&pa.images[0].mediaId){
            console.log("pa.images[0].id----------"+pa.images[0].id);
            imgHandleTrigger.Syncimg(pa.images[0].id).then(function(imgdoc){
                console.log("imgdoc----------"+imgdoc);
                assert.ok(imgdoc)
                imgHandleTrigger.Syncpa(pa._id,imgdoc).then(function(num){
                    (num > 0) && (console.log("saveAndUpdate Img Ok"));
                    done();
                });
            });
        }
    });
    //it("the transaction of save image to qn and update the doc", function (done) {
    //    var imageid = mock.image._id;
    //    var imageLoaded = null;
    //    ImageServicePro.loadAsync(imageid)
    //        .then(function(image){
    //            imageLoaded = image;
    //            return getAt().then(function(at){
    //                return qnServicePro.saveImageByServerIdAsync(at,image.mediaId,"123"+(new Date()).getTime());
    //            });
    //        })
    //        .then(function(result){
    //            assert.ok(result);
    //            return qnServicePro.MyimageInfoAsync({url:result.url});
    //        })
    //        .then(function(json){
    //            for(var p in json){
    //                typeof imageLoaded.meta[p] != "undefined" && (imageLoaded.meta[p] = json[p]);
    //            }
    //            return ImageServicePro.updateAsync(imageLoaded._id,imageLoaded);
    //            done();
    //        });
    //});
    ////it("update the imageshots by pa itself", function (done) {
    ////    ImageServicePro.loadAsync(mock.image._id)
    ////        .then(function(imageoriginal){
    ////            //更新imageshot
    ////            var images = [{
    ////                id:imageoriginal._id,
    ////                url:imageoriginal.url,
    ////                meta:imageoriginal.width+"|"+imageoriginal.height
    ////            }];
    ////            ProductActivityService.findAndUpateImageShot(paid,images,function(err,padoc){
    ////                assert.ok(padoc);
    ////                done();
    ////            });
    ////        });
    ////
    ////})
});


