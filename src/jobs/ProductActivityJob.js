var assert = require("assert");
var service = require('../services/ProductActivityService');
var util = require('util');
var logger = require('../app/logging').logger;
var ProductActivityActions = require('../models/ProductActivity').actions;
var time = require('../app/time');

var jobService = {};

jobService[ProductActivityActions.stopApply] = function(params, callback){
    var j=0;
    service.filter(params, function(err, docs){
        //TODO: error handling


        //logger.debug(docs);
        for (var i=0; i<docs.length; i++){
            var closingTime = docs[i].closingTime;
            try{
                closingTime = time.format(closingTime, "yyyy-MM-dd");
            }catch(e){logger.debug(e);}
            var now = time.currentTime();
            now = time.format(now, "yyyy-MM-dd");
            if (now > closingTime){//correct statement is >
                    logger.debug('try to stopApply activity id='+docs[i]._id+' name='+docs[i].name);
                    //console.log('try to stopApply activity id='+docs[i]._id+' name='+docs[i].name);
                    service.stopApply(docs[i]._id, function (err, doc) {
                        if (err!=null){
                            j++;
                        }
                        else{
                            logger.debug('stopApply success');
                            //console.log('stopApply success');
                        }
                    });
            }
        }

    })

    logger.debug('err count='+j);
    //console.log('err count='+j);
    callback((j!=0), true);



}

jobService[ProductActivityActions.act] = function(params, callback){
    var j=0;
    service.filter(params, function(err, docs){
        //TODO: error handling


        //logger.debug(docs);
        for (var i=0; i<docs.length; i++){
            var startTime = docs[i].startTime;
            try{
                startTime = time.format(startTime, "yyyy-MM-dd");
            }catch(e){logger.debug(e);}
            var now = time.currentTime();
            now = time.format(now, "yyyy-MM-dd");
            if (now >= startTime){
                logger.debug('try to act activity id='+docs[i]._id+' name='+docs[i].name);
                //console.log('try to act activity id='+docs[i]._id+' name='+docs[i].name);
                service.act(docs[i]._id, function(err, doc){
                    if (err!=null){
                        j++;
                    }
                    else{
                        logger.debug('act success');
                        //console.log('act success');
                    }
                });

            }
        }

    })

    logger.debug('err count='+j);
    //console.log('err count='+j);
    callback((j!=0), true);

}

jobService[ProductActivityActions.complete] = function(params, callback){
    var j=0;
    service.filter(params, function(err, docs){
        //TODO: error handling

        //logger.debug(docs);
        for (var i=0; i<docs.length; i++){
            var endTime = docs[i].endTime;
            try{
            endTime = time.format(endTime, "yyyy-MM-dd");
            }catch(e){logger.debug(e);}
            var now = time.currentTime();
            try{
            now = time.format(now, "yyyy-MM-dd");
            }catch(e){logger.debug(e);}
            if (now > endTime){//correct statement is >
                logger.debug('try to complete activity id='+docs[i]._id+' name='+docs[i].name);
                //console.log('try to complete activity id='+docs[i]._id+' name='+docs[i].name);
                service.complete(docs[i]._id, function(err, doc){
                    if (err!=null){
                        j++;
                    }
                    else{
                        logger.debug('complete success');
                        //console.log('complete success');
                    }


                });
            }
        }

    })

    logger.debug('err count='+j);
    //console.log('err count='+j);
    callback((j!=0), true);

}




module.exports = jobService;

