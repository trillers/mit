var userRoleEnum = require('../models/TypeRegistry').item('UserRole');
module.exports = function(req, res, next){
    var user = req.session.user.role;
    if(role === userRoleEnum.Teacher.value() && req.session.user.rolebinded) res.locals.__app.signUpOrSignIn = false;
    if(role === userRoleEnum.Teacher.value()) res.locals.__app.signUpOrSignIn = true;
    next();
}