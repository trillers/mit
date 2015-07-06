exports.testGroupSetUp = function(test){
    var mongoose = require('../../src/app/mongoose');
    var id = require('../../src/app/id');
    var rank = require('../../src/app/rank');
    var redis = require('../../src/app/redis');
    setTimeout((function() {
        test.done();
        console.info('test group began.');
    }), 500);
};
