var service = require('../../services/ProductActivityService');
var emailService = require('../../services/EmailService');
var userService = require('../../services/UserService');
var jobService = require('../../jobs/ProductActivityJob');
var util = require('util');
var fs = require("fs");
var path = require('path');
var ejs = require('ejs');
var csv = require('fast-csv');
var encode = require('encoding');
var logger = require('../../app/logging').logger;
var ApiReturn = require('../../framework/ApiReturn');
var imgHandleTrigger = require('../../app/imghandletrigger').imgHandlerTrigger;
var ApplicationFieldsArray = require('../../models/ApplicationFields');
var _pick = require('underscore')._.pick;
module.exports = function(router){
    require('../../app/routes-api')(router);
    var afilter = require('../../middlewares/auth-filter-anonymously');
    router.use(afilter);

    //create
    router.post('/', function(req, res){
        var pa = req.body;
        if(req.query.action=='publish'){
            pa.status = service.getPublishStatusValue();
        }

        service.create(pa, function(err, doc){
            if(pa && pa.images && pa.images[0] &&pa.images[0].mediaId){

                console.log("---------------------------------");
                console.log(pa);
                console.log("++++++++++++++++++++++++++++++++++");
                console.log(pa.images);
                console.log("---------------------------------");
                console.log(doc);
                console.log("++++++++++++++++++++++++++++++++++");
                console.log(doc.images);

                imgHandleTrigger.Syncimg(doc.images[0].id).then(function(imgdoc){
                    imgHandleTrigger.Syncpa(doc._id,imgdoc).then(function(num){
                        (num > 0) && (console.log("saveAndUpdate Img Ok"));
                    });
                });
            }
            //res.status(200).json(ApiReturn.i().ok(doc));
            if(pa && pa.introImgs){
                imgHandleTrigger.SyncImgs(pa.introImgs)
                    .then(function(imgs){
                        return imgHandleTrigger.SyncPa4Arr(doc._id, imgs)
                    })
                    .then(function(num){
                        (num > 0) && (console.log("saveAndUpdate Imgs Ok"));
                        res.status(200).json(ApiReturn.i().ok(doc));
                    })
            }else{
                res.status(200).json(ApiReturn.i().ok(doc));
            }
            //TODO: error handling
        });
    });

    //read
    router.get('/_:id', function(req, res){
        service.load(req.params.id, function(err, doc){
            //TODO: error handling
            res.status(200).json(ApiReturn.i().ok(doc));
        })
    });

    //update
    router.put('/_:id', function(req, res){
        var id = req.params.id;
        var update = req.body;

        if(req.query.action=='publish'){
            update.status = service.getPublishStatusValue();
        }

        service.update(id, update, function(err, doc){
            if(update && update.images && update.images[0] &&update.images[0].mediaId){

                console.log("---------------------------------");
                console.log(update);
                console.log("++++++++++++++++++++++++++++++++++");
                console.log(update.images);
                console.log("---------------------------------");
                console.log(doc);
                console.log("++++++++++++++++++++++++++++++++++");
                console.log(doc.images);

                imgHandleTrigger.Syncimg(doc.images[0].id).then(function(imgdoc){
                    imgHandleTrigger.Syncpa(id,imgdoc).then(function(num){

                    });
                });
            }
            if(update && update.introImgs){
                imgHandleTrigger.SyncImgs(update.introImgs)
                    .then(function(imgs){
                        return imgHandleTrigger.SyncPa4Arr(doc._id, imgs)
                    })
                    .then(function(num){
                        (num > 0) && (console.log("saveAndUpdate Imgs Ok"));
                        res.status(200).json(ApiReturn.i().ok(doc));
                    })
            }else{
                res.status(200).json(ApiReturn.i().ok(doc));
            }
            //TODO: error handling
            //res.status(200).json(ApiReturn.i().ok(doc));
        })
    });

    //delete
    router.delete('/_:id', function(req, res){
        var id = req.params.id;
        service.delete(id, function(err, doc){
            //TODO: error handling
            res.status(200).json(ApiReturn.i().ok(doc));
        })
    });

    //find
    router.post('/find', function(req, res){
        try{
            params = JSON.parse(JSON.stringify(req.body.filter));
        }
        catch(e){
            logger.error(e);
            throw e; //TODO
        }
        service.find(params, function(err, docs){
            //TODO: error handling
            res.status(200).json(ApiReturn.i().ok(docs));
        })
    });

    //filter
    router.post('/filter', function(req, res){
        try{
            params = JSON.parse(JSON.stringify(req.body.filter));
        }
        catch(e){
            logger.error(e);
            throw e; //TODO
        }
        service.filter(params, function(err, docs){
            //TODO: error handling
            res.status(200).json(ApiReturn.i().ok(docs));
        })
    });

    //initiated activities of mine
    router.post('/initiated', function(req, res){
        var uid = req.query.uid || req.session.user.id;
        service.findInitiated(uid, function(err, docs){
            //TODO: error handling
            res.status(200).json(ApiReturn.i().ok(docs));
        })
    });

    //applied activities of mine
    router.post('/applied', function(req, res){
        var uid = req.query.uid || req.session.user.id;
        service.findApplied(uid, function(err, docs){
            //TODO: error handling
            res.status(200).json(ApiReturn.i().ok(docs));
        })
    });


    //applied activities of mine
    router.get('/updateStatus', function(req, res){

        if (req.query.action=='stopApply'){
            var params = {
                conditions: {
                    status: {"$in": ['a']}//报名中
                }
            };
            jobService.stopApply(params, function (err, docs) {
                //TODO: error handling
                console.log("job stopApply err="+err+" docs="+docs);
                res.status(200).json(ApiReturn.i().ok(docs));
            })
        } else if (req.query.action=='act'){
            var params = {
                conditions: {
                    status: {"$in": ['re', 'a']}
                }
            };
            jobService.act(params, function (err, docs) {
                //TODO: error handling
                console.log("job act err="+err+" docs="+docs);
                res.status(200).json(ApiReturn.i().ok(docs));
            })
        } else if (req.query.action=='complete'){
            var params = {
                conditions: {
                    status: {"$in":['ac']}
                }
            };
            jobService.complete(params, function (err, docs) {
                //TODO: error handling
                console.log("job complete err="+err+" docs="+docs);
                res.status(200).json(ApiReturn.i().ok(docs));
            })
        }

    });


    //liked activities of mine
    router.post('/liked', function(req, res){
        var uid = req.query.uid || req.session.user.id;
        service.findLiked(uid, function(err, docs){
            //TODO: error handling
            res.status(200).json(ApiReturn.i().ok(docs));
        })
    });
    //stard activities of mine
    router.post('/stard', function(req, res){
        var uid = req.query.uid || req.session.user.id;
        service.findStard(uid, function(err, docs){
            //TODO: error handling
            res.status(200).json(ApiReturn.i().ok(docs));
        })
    });
    //like
    router.get('/_:id/like', function(req, res) {
        var thingId = req.params.id;
        var uid = req.query.uid || req.session.user.id;

        logger.debug(util.format('User %s like %s', uid, thingId));
        service.like(uid, thingId, function(err, doc) {
            //TODO: error handling
            res.status(200).json(ApiReturn.i().ok(doc));
        });
    });
    //star
    router.get('/_:id/star', function(req, res) {
        var thingId = req.params.id;
        var uid = req.query.uid || req.session.user.id;

        logger.debug(util.format('User %s star %s', uid, thingId));
        service.star(uid, thingId, function(err, doc) {
            //TODO: error handling
            res.status(200).json(ApiReturn.i().ok(doc));
        });
    });
    //add application
    router.post('/_:id/application', function(req, res) {
        var thingId = req.params.id;
        var application = req.body;

        service.addApplication(thingId, application, function(err, doc) {
            //TODO: error handling
            res.status(200).json(ApiReturn.i().ok(doc));
        });
    });

    router.get('/applications_:id', function(req, res) {
        var thingId = req.params.id;
        logger.debug("sst send csv file");

        service.load(thingId, function(err, docs) {
            //TODO: error handling
            //res.status(200).json(ApiReturn.i().ok(true));
            var stream = null;
            var filename = "public/applications_" + thingId + ".csv";
            stream = fs.createWriteStream(filename);
            stream.on("finish", function(){
                console.log("dump to csv ok!");

                fs.readFile(filename, "utf-8", function(err, data){
                    if (err){
                        console.log(err);
                        //todo
                        res.status(404).json(ApiReturn.i().error('未找到文件'));
                    }
                    else{
                        res.writeHead(200, {'Content-Type': 'text/csv', 'Content-Disposition':'attachment;filename='+'applications_'+thingId+'.csv'});
                        var encoding = require('encoding');
                        var result = encoding.convert(data, 'gb2312');
                        console.log(result);
                        res.write(result);
                        res.end();

                        fs.unlink(filename);
                    }
                });



            });



            var csvStream = csv.format({headers: true})
                .transform(function(row){

                    var item = {};
                    try {
                        var itemLen = docs.applicationFields.length;
                        for (var i=0; i<itemLen; i++){
                            title = docs.applicationFields[i].title;
                            name = docs.applicationFields[i].name;
                            item[title] = row[name];
                        }
                        item['人数'] = row.num;
                        item['报名时间'] = row.crtOn;
                    }
                    catch(e){}
                    return item;
/*                    return {
                        姓名: row.displayName
                        , 手机: row.phone
                        , 人数: row.num
                        , 性别: row.gender
                        , 出生日期: row.birthday
                        , 身份证: row.IDCard
                        , 单位: row.company
                        , 职位: row.position
                        , 行业: row.business
                        , 学校: row.school
                        , 专业: row.discipline
                        , 班级: row.class
                        , 备注: row.desc
                        , 昵称: row.applicant
                        , 报名时间: row.crtOn
                    };*/
                });

            csvStream.pipe(stream);

            var len = docs.applications.length;
            var j=0;

            docs.applications.forEach(function(row){

                var _crtOn = ((row['crtOn']==undefined)?'':((new Date(row['crtOn'])).format("yyyy-MM-dd")));

                var item = {};
                var itemLen = docs.applicationFields.length;
                for (var i=0; i<itemLen; i++){
                    title = docs.applicationFields[i].title;
                    name = docs.applicationFields[i].name;
                    item[name] = row[name];
                }
                item.num = row['num'];
                item.crtOn = _crtOn;
                var _gender = ((row['gender']==undefined)?'':(row['gendor']==0?'男':'女'));
                var _birthday = ((row['birthday']==undefined)?'':((new Date(row['birthday'])).format("yyyy-MM-dd")));
                if (!(row['gender']==undefined)){
                    item.gender = _gender;
                }
                if (!(row['birthday']==undefined)){
                    item.birthday = _birthday;
                }
                if (!(row['IDCard']==undefined)){
                    item.IDCard = item.IDCard + '\t';
                }
                if (!(row['phone']==undefined)){
                    item.phone = item.phone + '\t';
                }
                csvStream.write(item);
/*                csvStream.write({displayName:row['displayName'], phone: row['phone'], num: row['num']
                    , gender:_gender, birthday:_birthday, IDCard: row['IDCard'], company: row['company']
                    , position: row['position'], business: row['business'], school: row['school']
                    , discipline: row['discipline'], class: row['class'], desc: row['desc']
                    , applicant: row['applicant'].displayName, crtOn: _crtOn});*/
                j++;
                if (j==len){
                    csvStream.end();
                    logger.debug("sst create csv success");
                }
            });


        });

    });

    //list applications
    router.get('/_:id/applications', function(req, res) {
        var thingId = req.params.id;
        var action = req.query.action;
        var mailbox = req.query.mailbox;
        var paName = req.query.name;

        if (action=="mail"){
            var dwUrl = "http://www.zz365.com.cn/api/pa/applications_" + thingId;
            var template = fs.readFileSync(path.join(__dirname, '../../views/email-template.ejs'), 'utf-8');
            var html = ejs.render(template, {name: paName, url: dwUrl});

            var userId = req.session.user.id;
            var contact = {'contact.email': mailbox};
            userService.updateContact(userId, contact, function(err){
                logger.info('update user [id: ' + userId + '] contact ' + err);
            });

            emailService.send(mailbox, '活动报名清单导出', html, function (err, msg) {
                if (err) {
                    res.status(500).json(ApiReturn.i().error('failed to send eamil'));
                } else {
                    res.status(200).json(ApiReturn.i().ok(msg));
                }
            });

        }
        else{
            service.listApplications(thingId, function(err, docs) {
                //TODO: error handling
                res.status(200).json(ApiReturn.i().ok(docs));
            });
        }
    });

    router.post('/_:id/applications', function(req, res) {
        var thingId = req.params.id;
        var filter = req.body.filter;

        service.loadApplications(thingId, filter, function(err, docs) {
            //TODO: error handling
            res.status(200).json(ApiReturn.i().ok(docs));
        });
    });

    //upgrade applications key
    router.get('/upgrade', function(req, res) {
        var params = {
            sort: {'rank':-1},
            page: {
            },
            conditions: {
            }
        };

        service.find(params, function(err, docs){
            docs.forEach(function(doc){
                service.listApplications(doc._id, function(err, applications) {
                    var apps = 0;
                    applications.forEach(function(app){
                        apps += app.num;
                    });
                    service.findAndUpateApplications(doc._id, apps, function(err, cb){

                    });
                });
            });
            //TODO: error handling
            res.status(200).json(ApiReturn.i().ok(true));
        });
    });

    //add comment
    router.post('/_:id/comment', function(req, res) {
        var thingId = req.params.id;
        var comment = req.body;

        service.addComment(thingId, comment, function(err, doc) {
            //TODO: error handling
            res.status(200).json(ApiReturn.i().ok(doc));
        });
    });

    //delete
    router.delete('/_:id/comment', function(req, res){
        var id = req.params.id;
        var cmId = req.body.deleteId;
        service.deleteComment(id, cmId, function(err, doc){
            //TODO: error handling
            res.status(200).json(ApiReturn.i().ok(doc));
        })
    });

    //list comments
    router.get('/_:id/comments', function(req, res) {
        var thingId = req.params.id;
        service.listComments(thingId, function(err, docs) {
            //TODO: error handling
            res.status(200).json(ApiReturn.i().ok(docs));
        });
    });

    //publish
    router.get('/_:id/publish', function(req, res) {
        var thingId = req.params.id;
        var uid = req.query.uid || req.session.user.id;

        logger.debug(util.format('User %s publish %s', uid, thingId));
        service.publish(thingId, uid, function(err, result) {
            var errmsg = null;
            var errcode = 1; //unknown error
            if(err){
                errmsg = ''+err;
            }
            else{
                !result && (errmsg = '无法发布');
            }

            if(errmsg){
                res.status(200).json(ApiReturn.i().error(errcode, errmsg));
            }
            else{
                res.status(200).json(ApiReturn.i().ok(true));
            }
        });
    });

    //recall
    router.get('/_:id/recall', function(req, res) {
        var thingId = req.params.id;
        var uid = req.query.uid || req.session.user.id;

        logger.debug(util.format('User %s recall %s', uid, thingId));
        service.recall(thingId, uid, function(err, result) {
            var errmsg = null;
            var errcode = 1; //unknown error
            if(err){
                errmsg = ''+err;
            }
            else{
                !result && (errmsg = '无法撤回');
            }

            if(errmsg){
                res.status(200).json(ApiReturn.i().error(errcode, errmsg));
            }
            else{
                res.status(200).json(ApiReturn.i().ok(true));
            }
        });
    });

    //cancel
    router.get('/_:id/cancel', function(req, res) {
        var thingId = req.params.id;
        var uid = req.query.uid || req.session.user.id;

        logger.debug(util.format('User %s cancel %s', uid, thingId));
        service.cancel(thingId, uid, function(err, result) {
            var errmsg = null;
            var errcode = 1; //unknown error
            if(err){
                errmsg = ''+err;
            }
            else{
                !result && (errmsg = '无法取消');
            }

            if(errmsg){
                res.status(200).json(ApiReturn.i().error(errcode, errmsg));
            }
            else{
                res.status(200).json(ApiReturn.i().ok(true));
            }
        });
    });

    //add random notes
    router.post('/_:id/uploadNotePic', function(req, res) {
        var id = req.params.id;
        var mediaId = req.body;
        var imgshot = {};
        var metadata = {};
        imgHandleTrigger.Syncimg(Object.keys(mediaId)[0]).then(function(imgdoc){
            imgshot = _pick(imgdoc, 'url', 'mediaId', 'meta', 'name');
            imgshot['id'] = Object.keys(mediaId)[0];
            imgshot['meta'] = imgshot.meta.width + '|' + imgshot.meta.height;
            res.status(200).json(ApiReturn.i().ok(imgshot));
        });
    });

    //add random notes
    router.post('/_:id/sendNote', function(req, res) {
        var id = req.params.id;
        var note = req.body;

        service.addRandomNote(id, note, function(err, doc) {
            //TODO: error handling
            res.status(200).json(ApiReturn.i().ok(doc));
        });
    });

    //delete random notes
    router.delete('/_:id/deleteNote', function(req, res){
        var id = req.params.id;
        var del_id = req.body.deleteId;
        service.deleteRandomNote(id, del_id, function(err, doc){
            //TODO: error handling
            res.status(200).json(ApiReturn.i().ok(doc));
        })
    });

    //list random notes
    router.get('/_:id/random-notes', function(req, res) {
        var id = req.params.id;
        service.listRandomNotes(id, function(err, docs) {
            //TODO: error handling
            res.status(200).json(ApiReturn.i().ok(docs));
        });
    });

    // activity apply
    router.post('/_:id/apply', function(req, res){
        var id = req.params.id;
        var tt = req.body;

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
    });
    ////send email
    //router.post('/send-email', function(req, res){
    //    var params = req.body;
    //    var template = ""
    //});
};