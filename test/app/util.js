exports.testReplaceVariables = function(test){
    var url = '';
    var ret = '';
    url = 'activity/_id/comment/new';
    ret = url.replace(/_(\w+)/, '_');
    console.info(url);
    console.info(ret);
    console.info('===========');

    url = 'activity/_:id/comment/_:cid';
    ret = url.replace(/_(:\w+)/g, '_');
    console.info(url);
    console.info(ret);
    console.info('===========');

    url = 'activity/_001/comment/_002';
    ret = url.replace(/_(\w+)/g, '_');
    console.info(url);
    console.info(ret);
    console.info('===========');


    url = 'activity/_:id/comment/_:cid';
    ret = url.match(/_(:\w+)/g);
    console.info(url);
    console.info(ret);
    console.info('===========');

    test.done();
};