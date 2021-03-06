var userService = require('../../services/UserService');
var userBizService = require('../../services/UserBizService');
var clazzStudentService = require('../../services/ClazzStudentService');
var clazzTeacherService = require('../../services/ClazzTeacherService');
var UserRole = require('../../models/TypeRegistry').item('UserRole');

var util = require('util');
var logger = require('../../app/logging').logger;
var ApiReturn = require('../../framework/ApiReturn');

module.exports = function(router){
    require('../../app/routes-api')(router);
    var afilter = require('../../middlewares/auth-filter-anonymously');
    router.use(afilter);

    //read
    router.get('/_:id', function(req, res){
        userService.loadById(req.params.id, function(err, doc){
            //TODO: error handling
            res.status(200).json(ApiReturn.i().ok(doc));
        })
    });

    //loadUserClass
    router.get('/myClazz', function(req, res){
        var user = req.session.user;
        var userId = user.id;
        var promise, result = {};
        if(user.role == UserRole.Student.value()){
            promise = clazzStudentService.loadByUserIdAsync(userId);
        }else if(user.role == UserRole.Teacher.value()){
            promise = clazzTeacherService.loadByUserIdAsync(userId);
        } else {
            return res.status(500).json(ApiReturn.i().error(500, 'error role'));
        }
        promise
            .then(function(user){
                result.user = user;
                return userBizService.loadUserClazzAsync(userId);
            })
            .then(function(doc){
                result.clazzes = doc.clazzes;
                res.status(200).json(ApiReturn.i().ok(result));
            });
    });

    //resetUserForChannel
    router.get('/resetUserForChannel', function(req, res){
        //var openidArray = ['oqSpUuLkPbGwAmCX8vJslexU3n2Y', 'oqSpUuPj3KedXmlSo6Icg9EVHh4w', 'oqSpUuHK2Vj9DaL93eYqzLo4e6Ow', 'oqSpUuJR2MjzH3Iy2TEkx5MkJ7hE'];
        var openidArray = ['oniQet5i2l5zgu4AemSUSzfDQ7HE','oniQet_1wleWcgfOEZDswDxRYSDQ', 'oniQet5LyVZBpbBvlERaUdaj1ZPQ', 'oniQet-PfAlF63MjN46hq74Vww8I', 'oniQet-V-zTnLbMncUQpOgwjPAaI', 'oniQet1nqyhoQEn_F1UaAx9Ao2Ag', 'oniQet4OV-o4tdFTomuBqeVHu2YA', 'oniQetzTZYlDnvk8_hC2LhW0Z_Hk', 'oniQet1SgwdePiLUKBUG-mX8BLLk', 'oniQetyizIGdytiqNlDge6nvQSw0', 'oniQetxwGP6I8C4lbBkwRrTpleiE', 'oniQet-PhD0zE-JTNfE6RBLnx7BE', 'oniQet0xiIuvd3ancjT6ePHmE39s', 'oniQet27QIn0EfRgC8zzDN0H41TE', 'oniQetwaIJM32YAGtQ-bfi48JcPU', 'oniQet7MfgCgzwC68MF9IV9a5Img' ];
        var update = {};
        update.subscribeCount = 0;
        update.channelFrom = '';
        userService.resetUser(openidArray, update, function(err, user){
            res.status(200).json(ApiReturn.i().ok(user));
        });
    });
};