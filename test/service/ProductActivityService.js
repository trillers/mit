var assert = require("assert");
var ProductActivityService = require("../../src/services/ProductActivityService");
var UserService = require("../../src/services/UserService");

describe('ProductActivityService', function(){
    describe('#findInitiated() and findApplied()', function(){
        var initiator = null;
        var applicant = null;
        var newActivity = require('../services/mocks/ProductActivity');
        var a1 = null;
        var a2 = null;

        before(function(done){
            setTimeout(function(){
                done();
            },200)
        });

        //Prepare initiator
        before(function(done){
            UserService.createAnonymously(function(err, user){
                initiator = user;
                assert.ok(!err);
                assert.ok(user);
                done();
            });
        });

        //Prepare applicant
        before(function(done){
            UserService.createAnonymously(function(err, user){
                applicant = user;
                assert.ok(!err);
                assert.ok(user);
                done();
            });
        });

        //Initiate an activity by initiator and apply it by applicant
        before(function(done){
            newActivity.name = 'my first initiated activity';
            newActivity.startTime = new Date();
            newActivity.endTime = new Date();
            newActivity.closingTime = new Date();
            newActivity.initiator = initiator._id;
            newActivity.initiator = initiator._id;
            newActivity.crtBy = initiator._id;
            newActivity.updBy = initiator._id;
            newActivity.crtOn = new Date();
            newActivity.updOn = new Date();

            ProductActivityService.create(newActivity,  function(err, activity){
                assert.ok(!err);
                assert.ok(activity);
                a1 = activity;
                var application = {displayName: '张三', phone: '13812345678', num: 2, desc: '有一个小孩'};
                application.updBy = applicant._id;
                application.applicant = applicant._id;
                ProductActivityService.addApplication(a1._id, application, function(err, application){
                    assert.ok(!err);
                    assert.ok(application);

                    ProductActivityService.load(a1._id, function(err, pa){
                        console.error(pa);
                        done();
                    });
                });
            });
        });

        //Initiate an activity by initiator and apply it by applicant
        before(function(done){
            newActivity.name = 'my second initiated activity';
            newActivity.startTime = new Date();
            newActivity.endTime = new Date();
            newActivity.closingTime = new Date();
            newActivity.initiator = initiator._id;
            newActivity.initiator = initiator._id;
            newActivity.crtBy = initiator._id;
            newActivity.updBy = initiator._id;
            newActivity.crtOn = new Date();
            newActivity.updOn = new Date();

            ProductActivityService.create(newActivity,  function(err, activity){
                assert.ok(!err);
                assert.ok(activity);
                a2 = activity;
                var application = {displayName: '张三', phone: '13812345678', num: 1, desc: '可以贡献车'};
                application.updBy = applicant._id;
                application.applicant = applicant._id;
                ProductActivityService.addApplication(a2._id, application, function(err, application){
                    assert.ok(!err);
                    assert.ok(application);
                    done();
                });
            });
        });

        it("get all initaitied activities of mine", function(done){
            ProductActivityService.findInitiated(initiator._id, function(err, list){
                console.info(list);
                assert.equal(list.length, 2);
                assert.equal(list[0]._id, a2._id);
                assert.equal(list[1]._id, a1._id);
                done();
            });
        });

        it("get all applied activities of mine", function(done){
            ProductActivityService.findApplied(applicant._id, function(err, list){
                console.info(list);
                assert.equal(list.length, 2);
                assert.equal(list[0]._id, a2._id);
                assert.equal(list[1]._id, a1._id);
                done();
            });
        });

    });

});