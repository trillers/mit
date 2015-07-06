var assert = require('assert');
var Registry = require('../../src/framework/fsm').Registry;
var Workflow = require('../../src/framework/fsm').Workflow;
describe('fsm', function(){
    var registry = null;
    describe('create', function(){
        it('create a blank fsm registry/store', function(done){
            registry = new Registry();
            assert.ok(registry);
            done();
        });
    });

    var workflow = null;
    var workflowName = 'sample';

    describe('registry', function(){
        it('create a new workflow', function(done){
            assert.ok(registry);

            workflow = registry.workflow(workflowName);
            assert.ok(workflow);

            done();
        });

        it('get an existed workflow', function(done){
            assert.ok(registry);

            var workflowExisted = registry.workflow(workflowName);
            assert.equal(workflowExisted, workflow);

            done();
        });

    });

    var sampleStates = {
        Draft: 'Draft',
        Reviewing: 'Reviewing',
        Applying: 'Applying',
        Ready: 'Ready',
        Acting: 'Acting',
        Completed: 'Completed',
        Cancelled: 'Cancelled'
    };
    var sampleActions = {
        publish: 'publish',
        approve: 'approve',
        reject: 'reject',
        stopApply: 'stopApply',
        act: 'act',
        complete: 'complete',
        cancel: 'cancel'
    };

    var wfInstance = null;
    describe('workflow', function(){
        describe('define', function(){
            it('define a new workflow', function(done){
                assert.ok(workflow);

                var wf = workflow.define({
                    initial: sampleStates.Draft,
                    transitions: [
                        {action: sampleActions.publish, from: sampleStates.Draft, to: sampleStates.Reviewing},
                        {action: sampleActions.approve, from: sampleStates.Reviewing, to: sampleStates.Applying},
                        {action: sampleActions.reject, from: sampleStates.Reviewing, to: sampleStates.Draft},
                        {action: sampleActions.stopApply, from: sampleStates.Applying, to: sampleStates.Ready},
                        {action: sampleActions.act, from: sampleStates.Ready, to: sampleStates.Acting},
                        {action: sampleActions.complete, from: sampleStates.Acting, to: sampleStates.Completed},
                        {action: sampleActions.cancel, from: sampleStates.Applying, to: sampleStates.Cancelled}
                        //{action: sampleActions.cancel, from: sampleStates.Ready, to: sampleStates.Cancelled},
                        //{action: sampleActions.cancel, from: sampleStates.Acting, to: sampleStates.Cancelled},
                    ]
                });

                assert.equal(wf, workflow);
                //console.info(JSON.stringify(workflow.actionMap));
                //console.info(workflow.actionList);
                //console.info(JSON.stringify(workflow.stateMap));
                //console.info(workflow.stateList);
                //console.info(workflow.transitionList);

                console.log(JSON.stringify(wf.stateActions()));
                console.log(JSON.stringify(registry.dict()));

                done();
            });
        });

        describe('newInstance', function(){
            it('new a workflow instance with initial state， and drive state with correct flow', function(done){
                assert.ok(workflow);

                wfInstance = workflow.newInstance(null);
                assert.ok(wfInstance);
                assert.equal(wfInstance.current(), sampleStates.Draft);
                assert.equal(wfInstance.availableActions()[0], sampleActions.publish);

                wfInstance.actions().publish();
                assert.equal(wfInstance.current(), sampleStates.Reviewing);
                assert.equal(wfInstance.availableActions()[0], sampleActions.approve);
                assert.equal(wfInstance.availableActions()[1], sampleActions.reject);

                wfInstance.actions().reject();
                assert.equal(wfInstance.current(), sampleStates.Draft);
                assert.equal(wfInstance.availableActions()[0], sampleActions.publish);

                wfInstance.actions().publish();
                assert.equal(wfInstance.current(), sampleStates.Reviewing);
                assert.equal(wfInstance.availableActions()[0], sampleActions.approve);
                assert.equal(wfInstance.availableActions()[1], sampleActions.reject);

                wfInstance.actions().approve();
                assert.equal(wfInstance.current(), sampleStates.Applying);
                assert.equal(wfInstance.availableActions()[0], sampleActions.stopApply);
                assert.equal(wfInstance.availableActions()[1], sampleActions.cancel);

                wfInstance.actions().stopApply();
                assert.equal(wfInstance.current(), sampleStates.Ready);
                assert.equal(wfInstance.availableActions()[0], sampleActions.act);
                //assert.equal(wfInstance.availableActions()[1], sampleActions.cancel);

                wfInstance.actions().act();
                assert.equal(wfInstance.current(), sampleStates.Acting);
                assert.equal(wfInstance.availableActions()[0], sampleActions.complete);
                //assert.equal(wfInstance.availableActions()[1], sampleActions.cancel);

                wfInstance.actions().complete();
                assert.equal(wfInstance.current(), sampleStates.Completed);
                assert.equal(wfInstance.availableActions().length, 0);

                done();
            });

        });

        describe('current', function(){
            it('get current status', function(done){
                assert.ok(workflow);

                wfInstance = workflow.newInstance(sampleStates.Draft);
                assert.equal(wfInstance.current(), sampleStates.Draft)

                wfInstance = workflow.newInstance(sampleStates.Reviewing);
                assert.equal(wfInstance.current(), sampleStates.Reviewing)

                wfInstance = workflow.newInstance(sampleStates.Applying);
                assert.equal(wfInstance.current(), sampleStates.Applying)

                wfInstance = workflow.newInstance(sampleStates.Ready);
                assert.equal(wfInstance.current(), sampleStates.Ready)

                wfInstance = workflow.newInstance(sampleStates.Acting);
                assert.equal(wfInstance.current(), sampleStates.Acting)

                wfInstance = workflow.newInstance(sampleStates.Completed);
                assert.equal(wfInstance.current(), sampleStates.Completed)

                wfInstance = workflow.newInstance(sampleStates.Cancelled);
                assert.equal(wfInstance.current(), sampleStates.Cancelled)

                done();
            });
        });

        describe('is', function(){
            it('is status', function(done){
                assert.ok(workflow);

                wfInstance = workflow.newInstance(sampleStates.Draft);
                assert.ok(wfInstance.is(sampleStates.Draft));
                done();
            });
        });

        describe('can', function(){
            it('is status', function(done){
                assert.ok(workflow);

                wfInstance = workflow.newInstance(sampleStates.Draft);
                assert.ok(wfInstance.can(sampleActions.publish));

                wfInstance = workflow.newInstance(sampleStates.Reviewing);
                assert.ok(wfInstance.can(sampleActions.approve));
                assert.ok(wfInstance.can(sampleActions.reject));
                assert.ok(!wfInstance.can(sampleActions.publish));

                done();
            });
        });




        /*
         {action: sampleActions.publish, from: sampleStates.Draft, to: sampleStates.Reviewing},
         {action: sampleActions.approve, from: sampleStates.Reviewing, to: sampleStates.Applying},
         {action: sampleActions.reject, from: sampleStates.Reviewing, to: sampleStates.Draft},
         {action: sampleActions.stopApply, from: sampleStates.Applying, to: sampleStates.Ready},
         {action: sampleActions.act, from: sampleStates.Ready, to: sampleStates.Acting},
         {action: sampleActions.complete, from: sampleStates.Acting, to: sampleStates.Completed},
         {action: sampleActions.cancel, from: sampleStates.Applying, to: sampleStates.Cancelled},
         {action: sampleActions.cancel, from: sampleStates.Ready, to: sampleStates.Cancelled},
         {action: sampleActions.cancel, from: sampleStates.Acting, to: sampleStates.Cancelled},

         */

    });


});