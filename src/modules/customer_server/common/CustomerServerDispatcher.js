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
    console.log(message);
    console.log('=========================================');
    var msg = JSON.parse(message);
    var csId = msg.csId;
    console.log(msg);
    var cs = this.getCustomerServerById(csId);
    console.log(cs);

    if(cs){
        cs.emit('message', msg);
    }
};

prototype.publishMessage = function(csId, user, msg){
    console.log('------------------------------------------')
    console.log(csId);
    console.log(msg);
    msg.csId = csId;
    msg.customer = user;
    this.publishClient.publish('customer server message', JSON.stringify(msg));
}

prototype.registryCustomerServer = function(csId, cs){
    this.customerServers[csId] = cs;
    csskv.setCSLoadById(csId, function(){
        //TODO
    });
}

prototype.delCustomerServer = function(csId){
    delete this.customerServers[csId];
}

prototype.getCustomerServerById = function(csId){
    csskv.modifyCSLoadById(csId, 1, function(){
        //TODO
    });
    return this.customerServers[csId];
}

prototype.getLightLoadCustomerServerId = function(){
    return csskv.loadCSLoadAsync()
        .then(function(csLoad){
            console.log('had load csLoad');
            console.log(csLoad);
            var key, load = 100000;

            for(k in csLoad){
                console.log(k);
                console.log(parseInt(csLoad[k]) <= load)
                if(parseInt(csLoad[k]) <= load){
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
                    console.log('has session');
                    return self.publishMessage(css.csId, user, message);
                }
                self.getLightLoadCustomerServerId()
                    .then(function(csId){
                        console.log('0000000')
                        console.log(csId);
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
                        console.log('9999');
                        console.log(css);
                        return self.publishMessage(css.csId, user, message);
                    });
            })
    }
}

module.exports = CustomerServerDispatcher;