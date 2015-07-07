var User = require('../models/User').model;
var UserHelper = require('../models/User').helper;
//var UserState = require('../models/enums').UserState;
var UserKv = require('../kvs/User');
var UserMetaKv = require('../kvs/UserMeta');
var time = require('../app/time');
var http = require('http');
var settings = require('mit-settings');
var logger = require('../app/logging').logger;
var u = require('../app/util');
var wechat = require('../app/wechat/api');
var Service = {};
var Promise = require('bluebird');
var cbUtil = require('../framework/callback');
var generateUserToken = function(uid){
    var key = settings.secretKey;
    return require('crypto').createHash('sha1').update(String(uid)).update(key).digest('hex');
};

Promise.promisifyAll(User);
var createUser = function (userInfo, callback) {
    var user = new User(userInfo);
    var uid = user.autoId();
    user.token = generateUserToken(uid); //TODO: use token generator
    user.save(function (err, result, affected) {
        //TODO: logging
        cbUtil.handleAffected(callback, err, result, affected);
    });
};
var createUserAsync = Promise.promisify(createUser);
var updateUser = function (id, update, callback) {
    User.findById(id, function (err, doc) {
        if (err) {
            logger.error('Fail to update user [id=' + id + ']: ' + err);
            if (callback) callback(err);
            return;
        }
        if (doc) {
            u.extend(doc, update);
            doc.increment(); //TODO: do it in pre-save event
            doc.save(function (err, result, numberAffected) {
                cbUtil.handleAffected(callback, err, result, numberAffected);
            });
        }
        else {
            logger.warn('Fail to update user [id=' + id + '] because it does not exist');
            if (callback) callback(null, null);
        }
    });
};
var updateUserAsync = Promise.promisify(updateUser);

Service.loadById = function(id, callback){
    return UserKv.loadByIdAsync(id)
        .then(function(user){
            if(callback) callback(null, user);
            return user;
        })
        .catch(Error, function (err) {
            logger.error('Fail to load user by id: ' + err);
            if(callback) callback(err);
        });
};

Service.loadByOpenid = function (openid, callback) {
    return UserKv.loadIdByOpenidAsync(openid)
        .then(function(id){
            return id && UserKv.loadByIdAsync(id);
        })
        .then(function(user){
            if(callback) callback(null, user);
            return user;
        })
        .catch(Error, function (err) {
            logger.error('Fail to load user by wechat openid: ' + err);
            if(callback) callback(err);
        });
};

Service.loadByToken = function (token, callback) {
    var tokenId = null;
    var openid = null;
    return UserKv.loadIdByTokenAsync(token)
        .then(function(id){
            return id && UserKv.loadByIdAsync(id);
        })
        .then(function(user){
            tokenId = user.id;
            openid = user.wx_openid;
            if(openid){
                return UserKv.loadIdByOpenidAsync(openid)
                    .then(function(id){
                        return id && UserKv.loadByIdAsync(id);
                    })
                    .then(function(user){
                        if(callback) callback(null, user);
                        return user;
                    })
                    .catch(Error, function (err) {
                        logger.error('Fail to load user by wechat openid: ' + err);
                        if(callback) callback(err);
                    });
            }
            else{
                return user;
            }
        })
        .then(function(user){
            if(callback) callback(null, user);
            return user;
        })
        .catch(Error, function (err) {
            logger.error('Fail to load user by token: ' + err);
            if(callback) callback(err);
        });
};

Service.load = function (id, callback) {
    User.findById(id).lean(true).exec(function(err, doc){
        if (err) {
            logger.error('Fail to load user [id=' + id + ']: ' + err);
            if(callback) callback(err);
            return;
        }

        logger.debug('Succeed to load user [id=' + id + ']');
        if(callback) callback(null, doc);
    });
};

var client = function(message, callback){

    //http://api.map.baidu.com/geocoder/v2/?ak=PwCZ3FQOyXeHDQKRQZvsrL8k&callback=showLocation&location=40.066280,116.340149&output=json
    logger.debug('inside client call1');
    var options = {
        hostname: settings.locationServer.host,
        port: settings.locationServer.port,
        path: '/geocoder/v2/?ak=' + settings.locationServer.ak + '&location=' + message.Latitude + ',' + message.Longitude + '&output=json&coordtype=wgs84ll',
        method: 'GET'
    };
    logger.debug('before client call2');
    var req = http.request(options, function(res){
        logger.debug('status:'+res.statusCode);
        //console.log('headers:'+JSON.stringify(res.headers));
        res.setEncoding('utf8');
        logger.debug('before client call3');
        res.on('data', function(chunk){
            logger.debug('body:'+chunk);
            if (callback){
                var body = "";
                var city = "";
                var address = "";
                try {
                    body = JSON.parse(chunk);
                    if (body.status==0){
                        console.log(body.result.addressComponent.city);
                        city = body.result.addressComponent.city;
                        address = body.result.formatted_address;
                    }
                } catch(e) {}

                callback(null, city, address);
            }
        });
    });

    req.on('error', function(e){
        logger.debug('problem with req:'+ e.message);
    });
    req.end();


}

Service.updateLocation = function (message, userid, callback) {

    logger.debug('before client call');
    client(message, function(err, city, address){
        logger.debug('inside client call back1');
        var update = {
            latestLongitude: message.Longitude,
            latestLatitude: message.Latitude,
            latestPrecision: message.Precision,
            latestLocationCity: city,
            latestLocationAddress: address,
            latestLocationTime: time.currentTime()
        };
        logger.debug('inside client call back2');
        if (userid==null){
            logger.debug('inside client call back3');
            UserKv.loadIdByOpenidAsync(message.FromUserName)
                .then(function(id) {
                    logger.debug('sst userid change to: ' + id);
                    //return city name
                    User.findById(id, function (err, doc) {
                        if (err) {
                            logger.error('Fail to update user [id=' + id + ']: ' + err);
                            if (callback) callback(err);
                            return;
                        }
                        if (doc) {
                            u.extend(doc, update);
                            doc.increment(); //TODO: do it in pre-save event
                            doc.save(function (err, result, numberAffected) {
                                logger.debug('sst result:' + result + ' numberAffected: ' + numberAffected + ' id: ' + id);
                                cbUtil.handleAffected(callback, err, result, numberAffected);
                            });
                        }
                        else {
                            logger.warn('Fail to update user [id=' + id + '] because it does not exist');
                            if (callback) callback(null, null);
                        }
                    });

                });
        }
        else{
            //return city name
            logger.debug('inside client call back4');
            User.findById(userid, function (err, doc) {
                logger.debug('inside client call back5');
                if (err) {
                    logger.error('Fail to update user [id=' + userid + ']: ' + err);
                    if (callback) callback(err);
                    return;
                }
                if (doc) {
                    u.extend(doc, update);
                    doc.increment(); //TODO: do it in pre-save event
                    doc.save(function (err, result, numberAffected) {
                        logger.debug('sst result:' + result + ' numberAffected: ' + numberAffected + ' id: ' + userid);
                        cbUtil.handleAffected(callback, err, result, numberAffected);
                    });
                }
                else {
                    logger.warn('Fail to update user [id=' + userid + '] because it does not exist');
                    if (callback) callback(null, null);
                }
            });

        }

    });




}

Service.createAnonymously = function (callback) {
    var userInfo = {
        stt: UserState.Anonymous
    };
    return createUserAsync(userInfo)
        .then(function (user) {
            var userJson = user.toObject({virtuals: true});
            userJson.id = user.id;
            return userJson;
        })
        .then(UserKv.saveByIdAsync)
        .then(function (userJson) {
            return UserKv.linkTokenAsync(userJson.token, userJson.id)
                .then(function () {
                    return userJson;
                });
        })
        .then(function (userJson) {
            if(callback) callback(null, userJson);
            return userJson;
        })
        .catch(Error, function (err) {
            logger.error('Fail to create user from anonymous: ' + err);
            if(callback) callback(err);
        });
};

/**
 *  Create a registered user from wechat, not an anonymous user
 * @param user user json object
 * @param callback
 */
Service.createFromWechat = function (userInfo, callback) {
    userInfo.stt = UserState.Registered;
    return createUserAsync(userInfo)
        .then(function (user) {
            return UserHelper.getUserJsonFromModel(user);
        })
        .then(function (userJson) {
            return UserKv.saveByIdAsync(userJson);
        })
        //.then(UserKv.saveByIdAsync)
        .then(function (userJson) {
            return UserKv.linkTokenAsync(userJson.token, userJson.id)
                .then(function () {
                    return userJson;
                });
        })
        .then(function (userJson) {
            return UserKv.linkOpenidAsync(userJson.wx_openid, userJson.id)
                .then(function () {
                    return userJson;
                });
        })
        .then(function (userJson) {
            if(callback) callback(null, userJson);
            return userJson;
        })
        .catch(Error, function (err) {
            logger.error('Fail to create user from wechat: ' + err);
            if(callback) callback(err);
        });
};


var getUserFromWechat = function(openid, callback){
    wechat.api.getUser(openid, function(err, userInfo){
        if(err){
            if(callback) callback(err);
        }
        else{
            if(callback) callback(null, userInfo);
        }
    });
};
Service.getUserFromWechat = getUserFromWechat;

var getUserFromWechatAsync = Promise.promisify(getUserFromWechat);
Service.getUserFromWechatAsync = getUserFromWechatAsync;

Service.loadOrCreateFromWechat = function(openid, callback){
    return UserKv.loadIdByOpenidAsync(openid)
        .then(function(id){
            return id && UserKv.loadByIdAsync(id);
        })
        .then(function(user){
            if (user) return user;
            return getUserFromWechatAsync(openid)
                .then(function (userInfo) {
                    return UserHelper.getUserJsonFromWechatApi(userInfo);
                })
                .then(Service.createFromWechat);
        })
        .then(function(user){
            if(callback) callback(null, user);
            return user;
        })
        .catch(Error, function (err) {
            logger.error('Fail to load user by token: ' + err);
            if(callback) callback(err);
        });
};

Service.delete = function(id, callback) {
    User.findByIdAndRemove(id, function(err, doc){
        if (err) {
            logger.error('Fail to delete travel target [id=' + id + ']: ' + err);
            if(callback) callback(err);
            return;
        }

        logger.debug('Succeed to delete travel target [id=' + id + ']');
        if(callback) callback(null, doc);
    });
};


var deleteAsync = Promise.promisify(Service.delete);

Service.deleteByOpenid = function(openid, callback) {
    var userToDelete = null;
    return UserKv.loadIdByOpenidAsync(openid)
        .then(function(id){
            if(id){
                return deleteAsync(id)
                    .then(function(user){
                        userToDelete = user;
                    })
                    .then(function(){
                        if(userToDelete){
                            return UserKv.unlinkTokenAsync(userToDelete.token);
                        }
                    })
                    .then(function(){
                        if(userToDelete){
                            return UserKv.unlinkOpenidAsync(userToDelete.wx_openid);
                        }
                    })
                    .then(function(){
                        if(userToDelete){
                            return UserKv.deleteByIdAsync(userToDelete.id);
                        }
                    })
            }
            else{
                return;
            }
        })
        //.then(function(user){
        //    userToDelete = user;
        //    return UserKv.unlinkTokenAsync(userToDelete.token);
        //})
        //.then(function(){
        //    return UserKv.unlinkOpenidAsync(userToDelete.wx_openid);
        //})
        //.then(function(){
        //    return UserKv.deleteByIdAsync(userToDelete.id);
        //})
        .then(function(){
            if(callback) callback(null, userToDelete);
        })
        .catch(Error, function (err) {
            logger.error('Fail to delete user by id: ' + err);
            if(callback) callback(err);
        });
};



Service.update = function(id, update, callback){
    return updateUserAsync(id, update)
        .then(function(user){
            if(user){
                var userJson = user.toObject({virtuals: true});
                return UserKv.saveByIdAsync(userJson);
            }
            else{
                return null;
            }
        })
        .then(function (user) {
            if(callback) callback(null, user);
            return user;
        })
        .catch(Error, function(err){
            //TODO:
            if(callback) callback(err);
        });
};

Service.loadMeta = function (uid, callback) {
    UserMetaKv.getMeta(uid, callback);
};

var updateUserContact = function(uid, contact, callback){
    User.findOneAndUpdate({_id: uid}, contact, function(err, doc){
        if (err) {
            logger.error('Fail to update userContact [id=' + id + ']: ' + err);
            if (callback) callback(err);
            return;
        }
        if(callback) callback(null, doc);
    });
}

var updateUserContactAsync = Promise.promisify(updateUserContact);

Service.updateContact = function(uid, contact, callback){
    //return updateUserContactAsync(uid, contact)
    //    .then(function(user){
    //        if(user){
    //            var userJson = user.toObject({virtuals: true});
    //            return UserKv.saveByIdAsync(userJson);
    //        }
    //        else{
    //            return null;
    //        }
    //    })
    //    .then(function (user) {
    //        if(callback) callback(null, user);
    //        return user;
    //    })
    //    .catch(Error, function(err){
    //        //TODO:
    //        if(callback) callback(err);
    //    });
    User.update({_id:uid},contact,function(err,numberAffected,raw){
        if(err){
            logger.error('Fail to update user [id=' + uid + '] contact: ' + err);
            if(callback) callback(err);
        }else{
            logger.debug('Success to update user [id=' + uid + '] contact: ' );
            if(callback) callback(null);
        }
    });
};

Service.loadContact = function(uid, callback){
    User.findById(uid,'contact').lean(true).exec(function(err, doc){
        if (err) {
            logger.error('Fail to load user [id=' + uid + '] contact: ' + err);
            if(callback) callback(err);
            return;
        }

        logger.debug('Succeed to load user [id=' + uid + '] contact');
        if(callback) callback(null, doc);
    });
};

var tempUpdateUser = function(id, update, callback){
    User.findByIdAndUpdate(id, update, function (err, result){
        if(err) {
            callback(err);
        } else {
            callback(null, result);
        }
    })
}

var tempUpdateUserAsync = Promise.promisify(tempUpdateUser)

Service.tempUpdate = function(id, update, callback){
    return tempUpdateUserAsync(id, update)
        .then(function(user){
            if(user){
                var userJson = user.toObject({virtuals: true});
                //TODO: delete some associated properties
                return UserKv.saveByIdAsync(userJson);
            }
            else{
                return null;
            }
        })
        .then(function (user) {
            if(callback) callback(null, user);
            return user;
        })
        .catch(Error, function(err){
            //TODO:
            if(callback) callback(err);
        });
}

Service.resetUser = function(openidArray, update, callback){
    User.update({'wx_openid': {$in: openidArray}}, update, {multi:true}, function(err, result) {
       if(err) {
           callback(err);
       } else {
           callback(null, result);
       }
    });
}
module.exports = Service;