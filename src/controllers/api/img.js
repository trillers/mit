var service = require('../../services/ImageService');
var util = require('util');
var logger = require('../../app/logging').logger;
var ApiReturn = require('../../framework/ApiReturn');
var imgHandleTrigger = require('../../app/imghandletrigger');
var Events = require('../../framework/service/Events');
var responseListener = new Events();
module.exports = function(router){
    require('../../app/routes-api')(router);
    var afilter = require('../../middlewares/auth-filter-anonymously');
    router.use(afilter);

    //create
    router.post('/', function(req, res){
        var tt = req.body;
        service.create(tt, function(err, doc){
            //TODO: error handling
            res.status(200).json(ApiReturn.i().ok(doc));
        })
    });

    //save image array
    router.post('/images', function(req, res){
        var imgArr = req.body.imgArr, len = imgArr.length;
        var Image = function(img){
                this._id = img._id,
                this.mediaId = img.mediaId,
                this.name = img.name,
                this.localId = img.localId
            }, returnImgArr = [];
        for(var i = 0; i < len; i++){
            (function(i){
                //if(!imgArr[i]._id){
                //    service.create(imgArr[i], function(err, doc){
                //        //TODO: error handling
                //        if(err){
                //            logger.err('save image array err:' + err);
                //            return res.status(500).json(ApiReturn.i().error(err, 'save image array error'));
                //        }
                //        returnImgArr.push(new Image(doc));
                //        responseListener.emit('new_image_come', {len:len, returnImgArr:returnImgArr, res:res});
                //    })
                //}else{
                //    returnImgArr.push(new Image(imgArr[i]));
                //    responseListener.emit('new_image_come', {len:len, returnImgArr:returnImgArr, res:res});
                //}
                service.create(imgArr[i], function (err, doc) {
                    //TODO: error handling
                    if (err) {
                        logger.err('save image array err:' + err);
                        return res.status(500).json(ApiReturn.i().error(err, 'save image array error'));
                    }
                    returnImgArr.push(new Image(doc));
                    responseListener.emit('new_image_come', {len: len, returnImgArr: returnImgArr, res: res});
                })
            })(i)
        }

    });



    //read
    router.get('/_:id', function(req, res){
        service.load(req.params.id, function(err, doc){
            //TODO: error handling
            res.status(200).json(ApiReturn.i().ok(doc));
        })
    });

    //update
    router.put('/_:id', function(req, res){
        var id = req.params.id;
        var update = req.body;
        service.update(id, update, function(err, doc){
            //TODO: error handling
            res.status(200).json(ApiReturn.i().ok(doc));
        })
    });

    //delete
    router.delete('/_:id', function(req, res){
        var id = req.params.id;
        service.delete(id, function(err, doc){
            //TODO: error handling
            res.status(200).json(ApiReturn.i().ok(doc));
        })
    });

    responseListener.on('new_image_come', function(opt){
        if(opt.returnImgArr.length === opt.len) {
            console.log(opt.returnImgArr);
            return opt.res.status(200).json(ApiReturn.i().ok(opt.returnImgArr));
        }
    });
};