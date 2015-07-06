var ApiReturn = require('../../src/framework/ApiReturn');

exports.testApiReturn = function(test){
    var ret = null;
    var retStr = null;

    ret = ApiReturn.i().ok({
        _id: '001',
        name: 'suzhou'
    });
    retStr = '{"status":true,"result":{"_id":"001","name":"suzhou"}}';
    test.equals(JSON.stringify(ret), retStr);

    ret = ApiReturn.i().error('0001', 'fail to connect db');
    retStr = '{"status":false,"errcode":"0001","errmsg":"fail to connect db"}';
    test.equals(JSON.stringify(ret), retStr);

    test.done();
};