var csskv = require('../kvs/CustomerServer');
var redis = require('redis');
var Promise = require('bluebird');

var CustomerServerDispatcher = function(){
    this.customerServers = {};
    this.subscribeClient = redis.createClient();
    this.publishClient = redis.createClient();
    this.redisClientInit();
}

var prototype  = CustomerServerDispatcher.prototype;

prototype.redisClientInit = function(){
    var self = this;
    self.subscribeClient.on('subscribe', function(){
        console.log('redis client had subscribed');
    });
    self.subscribeClient.subscribe('customer server message');
    self.subscribeClient.on('message', self.handleMessage.bind(self));
}

prototype.handleMessage = function(channel, message){
    //TODO
    var msg = JSON.parse(message);
    var csId = msg.csId;
    var openId = msg.customer.wx_openid;
    var incrLoad = msg.ses;
    var cs = this.getCustomerServerById(csId, openId, incrLoad);
    if(cs){
        cs.emit('message', msg);
    }
};

prototype.publishMessage = function(csId, user, msg){
    msg.csId = csId;
    msg.customer = user;
    this.publishClient.publish('customer server message', JSON.stringify(msg));
}

prototype.registryCustomerServer = function(csId, cs){
    this.customerServers[csId] = cs;
    csskv.loadCSLoadByIdAsync(csId)
        .then(function(num){
            if(num) return   '';
            return csskv.setCSLoadByIdAsync(csId, 0);
        })
        .then(function(){
            //TODO
        });
}

prototype.delCustomerServer = function(csId){
    delete this.customerServers[csId];
}

prototype.getCustomerServerById = function(csId, openId, incrLoad){
    console.log('&&&&&&&&&&&&');
    console.log(csId);
    console.log(openId);
    console.log(incrLoad);
    if(incrLoad){
        console.log('add load and handing set');
        csskv.modifyCSLoadById(csId, 1, function(){
            //TODO
        });
        csskv.pushCSHandingSetById(csId, openId, function(){
            //TODO
        })
    }
    return this.customerServers[csId];
}

prototype.getLightLoadCustomerServerId = function(){
    return csskv.loadCSLoadAsync()
        .then(function(csLoad){
            var key, load = 100000;

            for(k in csLoad){
                if(parseInt(csLoad[k]) <= load){
                    load = parseInt(csLoad[k]);
                    key = k;
                }
            }
            return key;
        });
}

prototype.dispatch = function(user, message, csId){
    var self = this;
    if(csId){
        return self.publishMessage(csId, user, message);
    } else {
        csskv.loadCSSByOpenIdAsync(user.wx_openid)
            .then(function(css){
                if(css){
                    message.ses = true;
                    return self.publishMessage(css.csId, user, message);
                }
                self.getLightLoadCustomerServerId()
                    .then(function(csId){
                        var date = new Date();
                        var min = date.getMinutes();
                        date = date.setMinutes(min + 30);
                        var css = {
                            csId: csId,
                            expire: date
                        }
                        return csskv.saveCSSByOpenIdAsync(user.wx_openid, css);
                    })
                    .then(function(css){
                        return self.publishMessage(css.csId, user, message);
                    });
            })
    }
}

module.exports = CustomerServerDispatcher;