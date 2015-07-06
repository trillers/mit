exports.testGroupTearDown = function(test){
    var mongoose = require('../../src/app/mongoose');
    var redis = require('../../src/app/redis');
    setTimeout((function() {
        redis.quit();
        mongoose.disconnect();
        console.info('test group ended.');
    }), 1000);
    test.done();
};
