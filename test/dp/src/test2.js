var assert = require("assert");
var fs = require("fs");
function cbTaker(cb){
    return fs.readFileSync('./data.txt');
    //setTimeout(function(){
    //    cb()
    //}, 100);
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
    console.log(data)
})