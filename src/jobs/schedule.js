
var assert = require("assert");
var JobService = require("./ProductActivityJob");
var uService = require('../services/UserService');
var http = require('http');

var schedule = require("node-schedule");

/**
 *  test cmd:  node ./schedule.js
 */

///////the first style////////////
//var rule = new schedule.RecurrenceRule();
//rule.dayOfWeek = [0, new schedule.Range(1, 6)];
//rule.hour = 8;
//rule.minute = 49;

///
var minute = 0;
var hour = 1;
var postCron = ' * * *';



var p1 = minute.toString() + " " + hour.toString() + postCron;

/*
* The cron format consists of: [MINUTE] [HOUR] [DAY OF MONTH] [MONTH OF YEAR] [DAY OF WEEK] [YEAR (optional)]
* example: 每月每天的午夜 0 点 20 分, 2 点 20 分, 4 点 20 分....执行 echo "haha"
* schedule.scheduleJob('20 0-23/2 * * *', function...) echo "haha"
* */
var j = schedule.scheduleJob(p1, function() {//cron style call

//var j = schedule.scheduleJob(rule, function(){//the first style call

    console.log("执行任务1");
    ///////////
    console.log('check all ProductActivity which should stopApplied and update it!');

    var params = {
        sort: {'crtOn': -1},
        conditions: {
            status: {"$in": ['a']}//报名中
        }
    };

    JobService.stopApply(params, function (err, docs) {
        console.log("job stopApply err="+err+" docs="+docs);
    });
});

var p2 = (minute+1).toString() + " " + hour.toString() + postCron;
var k = schedule.scheduleJob(p2, function() {//cron style call

    console.log("执行任务2");
    //////
    console.log('check all ProductActivity which should act and update it!');

    var params = {
        sort: {'crtOn': -1},
        conditions: {
            status: {"$in": ['re', 'a']}
        }
    };


    JobService.act(params, function (err, docs) {
        console.log("job act err="+err+" docs="+docs);
    });
});

var p3 = (minute+2).toString() + " " + hour.toString() + postCron;
var l = schedule.scheduleJob(p3, function() {//cron style call

    console.log("执行任务3");
    //////////
    console.log('check all ProductActivity which should completed and update it!');

    var params = {
        sort: {'crtOn': -1},
        conditions: {
            status: {"$in":['ac']}
        }
    };


    JobService.complete(params, function(err, docs){
        console.log("job complete err="+err+" docs="+docs);
    });




});

var message = {
    ToUserName: 'gh_efb5d7c9539e',

    FromUserName: 'oqSpUuC-ze9g0-dNInlFLNHhuf34',

    CreateTime: '1429847235',

    MsgType: 'event',

    Event: 'LOCATION',

    Latitude: '40.066280',

    Longitude: '116.340149',

    Precision: '30.000000'
};


//uService.updateLocation(message, 'XamLw', function(err, doc){

//});


