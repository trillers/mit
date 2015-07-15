var assert = require("assert");
var fs = require("fs");
function cbTaker(cb){
    cb()
}
function zalgoContainer(cbTaker, cb){
    var sync = true;
    cbTaker(cbWrap);
    sync = false;
    function cbWrap(err, data){
        if(sync){
            console.log("sync")
            process.nextTick(function(err, data){
                cb(err, data);
            });
        }else{
            console.log("async")
            cb(err, data);
        }
    }
}

zalgoContainer(cbTaker, function(data){
    console.log("99999999")
});
console.log("111111111")
console.log("222222222")
setTimeout(function(){console.log("33333333")}, 200)
console.log("44444444444")