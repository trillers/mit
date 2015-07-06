var logger = require('../../app/logging').logger;
var service = require('../../services/ProductActivityService');
var userService = require('../../services/UserService');
var afilter = require('../../middlewares/auth-filter-anonymously');
var bfilter = require('../../middlewares/auth-filter-formally');
var PageInput = require('../../framework/PageInput');
var typeRegistry = require('../../models/TypeRegistry');
var ApiReturn = require('../../framework/ApiReturn');
var _pick = require('underscore')._.pick;
module.exports = function(router){
    require('../../app/routes-page')(router);

    router.get('/', afilter, function (req, res) {
        if(req.query.action==="create") return res.render('pa/publish-activity');
        if(req.query.action==="success") return res.render('pa/publish-success',{_id:req.query._id});
        var filter = req.params.filter; //TODO
        var params = {
            sort: {'updOn': -1},
            page: {
                size: 10,
                no: 1
            },
            conditions: {
            }
        };
        var user = req.user || {};
        service.filter(params, function (err, docs) {
            docs = docs || {};
            var pageInput = PageInput.i(req);
            pageInput.enums(typeRegistry.dict(['ProductActivityStatus']));
            pageInput.put('docs', docs);
            res.render('pa/index', {prod_list: pageInput||{}, likes: user});
        });
    });
    //create a activity
    router.post('/',afilter,function(req,res){
        var oper = req.body.oper;
        req.body.status = typeRegistry.dict(['ProductActivityStatus']).ProductActivityStatus.names[req.body.oper];
        service.create(req.body, function(err, doc){
            //doc.oper = oper;  doc["oper"] = oper  ？？？？
            if(err) return res.redirect('pa/new');
            //console.log("doc------------"+require('util').inspect(doc).oper);
            if(res.statusCode==200){
                return res.status(200).json(ApiReturn.i().ok(doc));
            }
            //errorHandler
            return res.json({err:"publish failed"});
        });
    });


    router.post('/_:id', function (req, res) {
        var action = req.query.action;
        if (action == "new") {
            addApplication(req, res);

        }
    });


    router.get('/_:id', afilter, function (req, res) {
        var id = req.params.id;
        logger.info('get travel target [id: ' + id + ']');
        service.load(id, function(err, tt){
            var pageInput = PageInput.i(req);
            pageInput.enums(typeRegistry.dict(['ProductActivityStatus']));
            pageInput.put('docs', tt);
            pageInput = pageInput || {}
            res.render('pa/product-activity', pageInput);
        });
    });



};

function addApplication(req, res) {
    var id = req.params.id;
    var tt = req.body;
    //var temp = {
    //    "displayName": "",
    //    "phone": "",
    //    "applicant":"",
    //    "num": "",
    //    "desc":""
    //};
    //
    //temp.displayName = tt.displayName;
    //temp.phone = tt.phone;
    //temp.applicant = tt.applicant;
    //temp.num = tt.num;
    //tt.desc && (temp.desc = tt.desc);

    var contactTem = _pick(tt, 'displayName', 'phone', 'gender', 'company', 'business', 'birthday', 'IDCard', 'school', 'class', 'discipline', 'position');
    var contact = {};
    var key;
    for(key in contactTem){
        var field = 'contact.' + key;
        contact[field] = contactTem[key];
    }
    userService.updateContact(tt.applicant, contact, function(err){
        logger.info('update user [id: ' + tt.applicant + '] contact ' + err);
    });

    service.addApplication(id, tt, function (err, result) {
        logger.info('addApplication [id: ' + id + ']' + + ' ' + err);
        if (result != null) {
            res.status(200).json(result);
        }

    });
}