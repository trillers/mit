var assert = require("assert");
var JobService = require("../../src/jobs/ProductActivityJob");
var UserService = require("../../src/services/UserService");
var ProductActivityService = require("../../src/services/ProductActivityService");


describe('ProductActivityJobService', function(){
    describe('#updateStatus()', function(){
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

        //produce data
if (true){
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
            newActivity.name = 'my first activity for job';
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

                ProductActivityService.publish(a1._id, a1.initiator, function(err, doc){

                });

                var application = {displayName: '阿大', phone: '13812345678', num: 2, desc: '有一个小孩'};
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
            newActivity.name = 'my second activity for job';
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

                ProductActivityService.publish(a2._id, a2.initiator, function(err, doc){

                });

                var application = {displayName: '阿二', phone: '13812345678', num: 1, desc: '可以贡献车'};
                application.updBy = applicant._id;
                application.applicant = applicant._id;
                ProductActivityService.addApplication(a2._id, application, function(err, application){
                    assert.ok(!err);
                    assert.ok(application);
                    done();
                });
            });
        });

}


        it("updateStatus when they should be stopApply", function(done){

            console.log('check all ProductActivity which should be stopApplied and update it!');

            var params = {
                sort: {'crtOn': -1},
                conditions: {
                    status: {"$in":['a']}//报名中
                }
            };

            JobService.stopApply(params, function(err, docs){
                console.log('stopApply err='+err+' docs='+docs);
                assert.ok(!err);


            });

            done();
        });




        it("updateStatus when they should be act", function(done){

            console.log('check all ProductActivity which should be act and update it!');

            var params = {
                sort: {'crtOn': -1},
                conditions: {
                    status: {"$in":['re', 'a']}
                }
            };


            JobService.act(params, function(err, docs){
                console.log('act err='+err+' docs='+docs);
                assert.ok(!err);


            });


            done();
        });



        it("updateStatus when they should be completed", function(done){

            console.log('check all ProductActivity which should be completed and update it!');

            var params = {
                sort: {'crtOn': -1},
                conditions: {
                    status: {"$in":['ac']}
                }
            };


            JobService.complete(params, function(err, docs){
                console.log('complete err='+err+' docs='+docs);
                assert.ok(!err);


            });


            done();
        });



    });

});