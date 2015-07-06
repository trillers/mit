var logger = require('../../app/logging').logger;
var UserService = require('../../services/UserService');
var MarketingCampaignService = require('../../services/MarketingCampaignService');
var MarketingCampaignUserService = require('../../services/MarketingCampaignUserService');
var MarketingCashPackService = require('../../services/MarketingCashPackService');
var MCSEnum = require('../../models/TypeRegistry').item('MarketingCampaignStrategy');
var QrChannelDispathcher = require('../../modules/qrchannel');
var time = require('../../app/time');
var inspect = require('util').inspect;
module.exports = function(router){
    require('../../app/routes-mc')(router);

    //banner redirect -- new user --
    router.get('/bannersubscribe', function(req, res){
        //new user
        if(req.session.user && req.session.user.wx_subscribe == 0 || req.session.user.subscribeCount === 0){
            res.render('mc/guide-subscribe');
        }else{
            //subscribed user
            MarketingCampaignService.getMCUAsync(req.session.user)
                .then(function(doc){
                    var mcu = doc.mcu;
                    if( !mcu.user.qrChannel || time.currentTime() > mcu.user.qrChannel.expires){
                        var key = QrChannelDispathcher.genKey(false, 'MC');
                        var handler = QrChannelDispathcher.handlers[key];
                        handler.create(null, function(err, qrChannel){
                            MarketingCampaignUserService.update(mcu._id, {'user.qrChannel': qrChannel._id}, function(err, doc){
                                res.render('mc/guide-subscribe', {mcuid: mcu._id, ticket: qrChannel.ticket, source: 'newshare'});
                            });
                        });
                    }else{
                        res.render('mc/guide-subscribe', {mcuid: mcu._id, ticket: mcu.user.qrChannel.ticket, source: 'newshare'});
                    }
                })
        }
    });

    //receive the redPack -- Guide to subscribe
    router.get('/guidesubscribe', function(req, res){
        var ticket = req.query.ticket;
        var mcuid = req.query.mcuid;
        var source = req.query.source;
        //new user
        console.log(req.session.user);
        console.log(req.session.user.wx_subscribe);
        console.log(req.session.user.subscribeCount === 0);
        console.log(req.session.user && req.session.user.wx_subscribe == 0 || req.session.user.subscribeCount === 0);

        if(req.session.user && req.session.user.wx_subscribe == 0 || req.session.user.subscribeCount === 0){
            console.log('new user come from friends');
            res.render('mc/guide-subscribe', {ticket: ticket, mcuid: mcuid, source: source});
        }else{
            console.log('old user come from friends');
            //old user and if owner?
            MarketingCampaignService.getMCUAsync(req.session.user)
                .then(function(doc){
                    var mcu = doc.mcu;
                    console.log(mcu);
                    if( !mcu.user.qrChannel || time.currentTime() > mcu.user.qrChannel.expires){
                        var key = QrChannelDispathcher.genKey(false, 'MC');
                        var handler = QrChannelDispathcher.handlers[key];
                        handler.create(null, function(err, qrChannel){
                            MarketingCampaignUserService.update(mcu._id, {'user.qrChannel': qrChannel._id}, function(err, doc){
                                res.render('mc/guide-subscribe', {mcuid: mcu._id, ticket: qrChannel.ticket, source: 'newshare'});
                            });
                        });
                    }else{
                        res.render('mc/guide-subscribe', {mcuid: mcu._id, ticket: mcu.user.qrChannel.ticket, source: 'newshare'});
                    }
                })
        }
    })

    //check rights -- success ? send redPack( success page ) : redirect to failed page
    router.get('/firstsubscribe', function(req, res){
        var mcuid = req.query.mcuid;
        console.log('----firstsubscribe-------');
        MarketingCampaignUserService.loadAsync(mcuid, function(err, mcu){
            console.log(mcu);
            if(err) {
                console.error("Failed to load MCU error is --- " + require('util').inspect(err));
                logger.error("Failed to load MCU error is --- " + require('util').inspect(err));
                return;
            }
            console.log('====loadMcu====');
            for(var i= 0, len=mcu.strategies.length; i<len; i++){
                console.log(mcu.strategies[i].id.name);
                console.log(MCSEnum.FirstSubscribe.value());
                console.log('++++++++++++++');
                if(mcu.strategies[i].id.name === MCSEnum.FirstSubscribe.value()){
                    if(!(mcu.strategies[i].attended)){
                        res.render('mc/redpack-receive-succeed', {mcuid: mcu._id});
                        return;

                    }else{
                        res.render('mc/redpack-receive-failed');
                        return
                    }
                }
            }
            throw new Error("MCU has no Strategies................");
        })
    });

    //redirect to share MarketingCampaign Page
    router.get('/sharemc', function(req, res){
        var mcuid = req.query.mcuid;
        MarketingCampaignUserService.loadAsync(mcuid)
            .then(function(mcu){
                if( !mcu.user.qrChannel || time.currentTime() > mcu.user.qrChannel.expires){
                    var key = QrChannelDispathcher.genKey(false, 'MC');
                    var handler = QrChannelDispathcher.handlers[key];
                    handler.create(null, function(err, qrChannel){
                        MarketingCampaignUserService.update(mcuid, {'user.qrChannel': qrChannel._id}, function(err, doc){
                            res.render('mc/guide-subscribe', {mcuid: mcuid, ticket: qrChannel.ticket, source: 'newshare'});
                        });
                    });
                }else{
                    res.render('mc/guide-subscribe', {mcuid: mcuid, ticket: mcu.user.qrChannel.ticket, source: 'newshare'});
                }
            })
    });

    //share Success -- sendRedPack
    router.post('/sharemc', function(req, res) {
        var mcuid = req.body.mcuid;
        var promise = null;
        var mcu = null;
        if(!mcuid){
            promise = MarketingCampaignService.getMCUAsync(req.session.user);
        }else{
            promise = MarketingCampaignUserService.loadAsync(mcuid);
        }
        promise
            .then(function (doc) {
                if (!doc) {
                    logger.error("Failed to load MCU error is null");
                    return res.json({result: 'nomcu'});
                }
                doc.mcu && ( mcu = doc.mcu ) || ( mcu = doc );
                var currentStrategy = null;
                for (var i = 0, len = mcu.strategies.length; i < len; i++) {
                    console.log(mcu.strategies[i].id.name);
                    console.log(MCSEnum.ShareMc.value());
                    console.log(mcu.strategies[i].id.name === MCSEnum.ShareMc.value());
                    if (mcu.strategies[i].id.name === MCSEnum.ShareMc.value()) {
                        console.log(mcu.strategies[i]);
                        console.log(!(mcu.strategies[i].attended));
                        currentStrategy = mcu.strategies[i];
                        break;
                    }
                }
                if (!(currentStrategy.attended)) {
                    MarketingCashPackService.sendRedPackWrapper(mcu, 100, 150, "分享多多，红包多多！", function (err, result) {
                        if (err) {
                            return res.json({result: 'failed'})
                        } else {
                            MarketingCampaignUserService.attendMc(mcuid, 'sm', function (err, result) {
                                console.log("%%%%%%%%%%%%%%%%===update===%%%%%%%%%%%%%");
                                if (err) {
                                    return res.json({result: 'failed'})
                                } else {
                                    return res.json({result: 'success'});
                                }
                            })
                        }
                    })
                }else{
                    console.log('====have attended========');
                    return res.json('failed');
                }
            });
    });

    router.post('/sendpack', function(req, res){
        console.log('=====start sendpack===========');
        var mcuId = req.body.mcuid;
        var strategyName = req.body.strategyname;
        MarketingCampaignUserService.findById(mcuId, function(err, mcu){
            console.log(mcu);
            MarketingCashPackService.sendRedPackWrapper(mcu, 100, 150, "感谢关注，红包送上！", function(err, doc){
                if(err){
                    console.log("Failed to Send RedPack errorMsg is -------" + inspect(err));
                    logger.error("Failed to Send RedPack errorMsg is -------" + inspect(err));
                    return res.json({result: 'failed'})
                }else{
                    MarketingCampaignUserService.attendMc(mcuId, strategyName, function(err, result){
                        if(err){
                            console.log("Failed to Update User attendMc Flag [errorMsg]  -------" + inspect(err));
                            logger.error("Failed to Update User attendMc Flag [errorMsg]  -------" + inspect(err));
                            res.json({result: 'failed'})
                        }else{
                            if(result && result.errorCode === "you are already attended"){
                                console.log("errorCode-----------------result--------" + inspect(result));
                                return res.json({result: 'failed'});
                            }
                            return res.json({result: 'success'});
                        }
                    })
                }
            })
        })
    });
};