var ApplicationFields = {
    'displayName': {
        type: 'text',
        name: 'displayName',
        title: '姓名',
        required: true
    },
    'phone': {
        type: 'phone',
        name: 'phone',
        title: '手机',
        required: true
    },
    'gender': {
        type: 'text',
        name: 'gender',
        title: '性别',
        required: false
    },
    'birthday': {
        type: 'date',
        name: 'birthday',
        title: '出生日期',
        required: false
    },
    'IDCard': {
        type: 'IDCard',
        name: 'IDCard',
        title: '身份证',
        required: false
    },
    'company': {
        type: 'text',
        name: 'company',
        title: '单位',
        required: false
    },
    'position': {
        type: 'text',
        name: 'position',
        title: '职位',
        required: false
    },
    'business': {
        type: 'text',
        name: 'business',
        title: '行业',
        required: false
    },
    'school': {
        type: 'text',
        name: 'school',
        title: '学校',
        required: false
    },
    'discipline': {
        type: 'text',
        name: 'discipline',
        title: '专业',
        required: false
    },
    'class': {
        type: 'text',
        name: 'class',
        title: '班级',
        required: false
    },
    'desc': {
        type: 'text',
        name: 'desc',
        title: '备注',
        required: false
    }
}

module.exports = ApplicationFields;