var TypeRegistry = require('../framework/model/TypeRegistry');
var registry = new TypeRegistry('TypeRegistry', 'TypeRegistry', 'TypeRegistry');

registry
.item('UserRole', 'UserRole', '用户角色')
    .addChild('Teacher','t', '教师')
    .addChild('Organization','o', '机构')
    .addChild('Student','s', '学生')
    .addChild('Guest','g', '游客')
.up().item('MsgChannelType', 'MsgChannelType', '频道类型')
    .addChild('Clazz','c', '班级')
    .addChild('Group','g', '群组')
    .addChild('Person','p', '个人')


module.exports = registry;