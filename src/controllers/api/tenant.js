var TenantService = require('../../services/TenantService');

var util = require('util');
var logger = require('../../app/logging').logger;
var ApiReturn = require('../../framework/ApiReturn');
var fs = require('fs');
var ejs = require('ejs');
var path = require('path');


module.exports = function(router){
    require('../../app/routes-api')(router);

    //create
    router.post('/', function(req, res){
        var tenant = req.body;
        TenantService.create(tenant, function (err, doc) {
            //TODO: error handling
            res.status(200).json(ApiReturn.i().ok(doc));
        })
    });

    //read
    router.get('/_:id', function(req, res){
        TenantService.load(req.params.id, function(err, doc){
            res.format({
                json: function(){
                    res.status(200).json(ApiReturn.i().ok(doc));
                },
                html: function(){
                    res.render('tenant', doc);
                }
            });
        })
    });

        //read
        router.get('/_:id/getIn', function(req, res){
            var uid = 0;

            //var template = fs.readFileSync(path.join(__dirname, '../../views/auth-fail.ejs'), 'utf-8');
            //var html = ejs.render(template);
            //
            //res.writeHead(200, {"Content-Type": "text/html"});
            //res.write(html);
            //res.end();

            var id = req.params.id;

            logger.info('tenant id=' + id);

            try{
                logger.info('req.session=' + JSON.stringify(req.session));
                logger.info('req.session.user=' + JSON.stringify(req.session.user));
                uid = req.query.uid || req.session.user.id;
                logger.info('sst uid=' + uid);
                logger.info('req.query.uid=' + req.query.uid);

                TenantService.getIn(id, uid, function(err, doc){
                    if (err){
                        logger.info('doc=' + doc);
                        var template = fs.readFileSync(path.join(__dirname, '../../views/auth-fail.ejs'), 'utf-8');
                        var html = ejs.render(template);

                        res.writeHead(200, {"Content-Type": "text/html"});
                        res.write(html);
                        res.end();
                        //res.status(403).json(ApiReturn.i().error('not a valid user'));
                    }
                    else {
                        logger.info('should return html page, doc=' + doc);
                        var template = fs.readFileSync(path.join(__dirname, '../../views/auth-success.ejs'), 'utf-8');
                        var html = ejs.render(template, {name: doc.name, _id:doc._id});

                        res.writeHead(200, {"Content-Type": "text/html"});
                        res.write(html);
                        res.end();
                        //res.status(200).json(ApiReturn.i().ok(doc));
                    }

                });
            }
            catch(e){
                logger.info('catch error =' + e);
                var template = fs.readFileSync(path.join(__dirname, '../../views/auth-fail.ejs'), 'utf-8');
                var html = ejs.render(template);

                res.writeHead(200, {"Content-Type": "text/html"});
                res.write(html);
                res.end();
            }



    });


    //update
    router.put('/_:id', function(req, res){
        var id = req.params.id;
        var update = req.body;
        TenantService.update(id, update, function(err, doc){
            //TODO: error handling
            res.status(200).json(ApiReturn.i().ok(doc));
        })
    });

    //delete
    router.delete('/_:id', function(req, res){
        var id = req.params.id;
        TenantService.delete(id, function(err, doc){
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
        TenantService.find(params, function(err, docs){
            //TODO: error handling
            res.status(200).json(ApiReturn.i().ok(docs));
        })
    });

    //filter
    router.post('/filter', function(req, res){
        var params = {};
        try{
            params = JSON.parse(JSON.stringify(req.body));
        }
        catch(e){
            logger.error(e);
            throw e; //TODO
        }
        TenantService.filter(params, function(err, docs){
            //TODO: error handling
            res.status(200).json(ApiReturn.i().ok(docs));
        })
    });

    //judge user if tenant member
    router.get('/_:id/ifTenantMember', function(req, res){
        var result = false;
        var id = req.params.id;
        var wx_openid = req.query.wx_openid;
        var params = {
            options: {_id: 0, tenantId: 1},
            conditions: {_id: id}
        }
        TenantService.filter(params, function(err, docs){
            //TODO: error handling
            if(err){
                logger.error('filter tenant err when judge user if tenant member: err' + err);
            }
            if(docs.length === 0){
                logger.error('filter tenant err when judge user if tenant member: there is no the tenant : tenantId' + id);
            } else {
              for(var i = 0, len = docs[0].members.length; i < len; i++){
                  if(docs[0].members[i].wx_openid === wx_openid){
                      result = true;
                      break;
                  }
              }
            }
            res.status(200).json(ApiReturn.i().ok(result));
        });
    });
};
