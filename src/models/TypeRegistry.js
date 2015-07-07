var TypeRegistry = require('../framework/model/TypeRegistry');
var registry = new TypeRegistry('TypeRegistry', 'TypeRegistry', 'TypeRegistry');

registry
.item('UserRole', 'UserRole', '用户角色')
    .addChild('Teacher','t', '教师')
    .addChild('Organization','o', '机构')
    .addChild('Student','s', '学生')


module.exports = registry;