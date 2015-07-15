
var fo = function(){
    console.log("000000000");
};

process.nextTick(function(){
    fo();
});

setTimeout(function(){
    console.log("222222222")
}, 500);