var ImageService = require("../services/ImageService");
var ProductActivityService = require("../services/ProductActivityService");
var qnService = require("./qn");
var getAt = require("./wechat/token").getAt;
var Promise = require('bluebird');
var qnServicePro = Promise.promisifyAll(qnService);
var ImageServicePro = Promise.promisifyAll(ImageService);
var util = require('util');
var events = require('events');
var randomArr = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
var _pick = require('underscore').pick;

function generateRandomStr(n) {
    var res = "";
    for(var i = 0; i < n ; i ++) {
        var id = Math.ceil(Math.random()*35);
        res += randomArr[id];
    }
    return res;
};

function ImgHandlerTrigger(){
    this.emitter = new events.EventEmitter();
};

var imgHandlerTrigger = {
    Syncimg:function(imageid){
        var imageLoaded = {};
        return ImageServicePro.loadAsync(imageid)
            .then(function(image){
                imageLoaded = image;
                return getAt().then(function(at){
                    return qnServicePro.saveImageByServerIdAsync(at,image.mediaId,image.name);
                });
            })
            .then(function(result){
                imageLoaded["url"] = result.url;
                return qnServicePro.MyimageInfoAsync({url:result.url});
            })
            .then(function(json){
                for(var p in json){
                    typeof imageLoaded.meta[p] != "undefined" && (imageLoaded.meta[p] = json[p]);
                }
                return ImageServicePro.updateAsync(imageLoaded._id,imageLoaded);
            });
    },
    SyncImgs: function(imgs, cb){
        var me = this;
        var returnImgs = [];
        for(var i = 0, len = imgs.length; i< len ; i++){
            if(!imgs[i].url){
                returnImgs.push(me.Syncimg(imgs[i].id));
            }else{
                returnImgs.push(imgs[i]);
            }
        }
        Promise.all(returnImgs).then(function(imgs){
            return cb(null, imgs);
        })
    },
    SyncPa4Arr: function(paid, imgs, cb){
        var imgShots = [], imgShot, currentImg = null;
        for(var i = 0, len = imgs.length; i < len; i++){
            currentImg = imgs[i];
            imgShot = {
                id: currentImg._id,
                url:"http://"+currentImg.url,
                mediaId: currentImg.mediaId,
                meta: currentImg.meta.width + "|" + currentImg.meta.height,
                name: currentImg.name,
                localId: currentImg.localId
            };
            imgShots.push(imgShot);
        }
        ProductActivityService.findAndUpateIntroImageShot(paid, imgShots, function(err,padoc){
            cb(err,padoc);
        });
    },
    Syncpa:function(paid,imginput,cb){
        //the input is an imgfulldoc(object) or an imgId(string)
        var _updatePaByImgDoc = function(imgdoc){
            var images = [{
                id:imgdoc._id,
                url:"http://"+imgdoc.url,
                mediaId:imgdoc.mediaId,
                meta:imgdoc.meta.width+"|"+imgdoc.meta.height,
                name:imgdoc.name
            }];
            ProductActivityService.findAndUpateImageShot(paid,images,function(err,padoc){
                cb(err,padoc);
            });
        };
        if(typeof imginput != "object"){
            ImageService.load(imginput)
                .then(function(imgdoc){
                    _updatePaByImgDoc(imgdoc)
                });
        }
        else{
            _updatePaByImgDoc(imginput);
        }
    },
    on:function(event,cb){
        console.log(this.emitter);
        this.emitter.on(event,cb);
    },
    trigger:function(event){
        this.emitter.emit(event);
    }
};
imgHandlerTrigger.Syncpa = Promise.promisify(imgHandlerTrigger.Syncpa);
imgHandlerTrigger.SyncPa4Arr = Promise.promisify(imgHandlerTrigger.SyncPa4Arr);
imgHandlerTrigger.SyncImgs = Promise.promisify(imgHandlerTrigger.SyncImgs);
ImgHandlerTrigger.prototype = imgHandlerTrigger;
//util.inherits(ImgHandlerTrigger,events.EventEmitter);

module.exports = {
    ImgHandlerTrigger:ImgHandlerTrigger,
    imgHandlerTrigger:imgHandlerTrigger
};

