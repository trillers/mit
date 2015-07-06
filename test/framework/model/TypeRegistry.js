var typeRegistry = require('../../../src//models/TypeRegistry');

exports.setUp = function(done){
    done();
};
exports.tearDown = function(done){
    done();
};

exports.testTypeRegistry = function(test){
    var LifeFlag = typeRegistry.item('LifeFlag');
    test.ok(LifeFlag);
    test.ok(LifeFlag.Active);
    test.ok(LifeFlag.Inactive);
    test.ok(LifeFlag.Deleted);

    test.equal(LifeFlag.Active.name(), 'Active');
    test.equal(LifeFlag.Active.value(), 'a');
    test.equal(LifeFlag.Active.title(), '活动');

    test.equal(LifeFlag.Inactive.name(), 'Inactive');
    test.equal(LifeFlag.Inactive.value(), 'i');
    test.equal(LifeFlag.Inactive.title(), '锁定');

    test.equal(LifeFlag.Deleted.name(), 'Deleted');
    test.equal(LifeFlag.Deleted.value(), 'd');
    test.equal(LifeFlag.Deleted.title(), '已删除');

    console.log('names:');
    console.log(LifeFlag.names());
    console.log('\r\n');

    console.log('values:');
    console.log(LifeFlag.values());
    console.log('\r\n');

    console.log('value names:');
    console.log(LifeFlag.valueNames());
    console.log('\r\n');

    console.log('valueList:');
    console.log(LifeFlag.valueList());
    console.log('\r\n');

    console.log('list:');
    console.log(LifeFlag.list());
    console.log('\r\n');

    console.log('dict:');
    console.log(LifeFlag.dict());
    console.log('\r\n');


    console.log(typeRegistry.dict());
    console.log(typeRegistry.dict(['LifeFlag', 'UserType']));


    test.done();
};
