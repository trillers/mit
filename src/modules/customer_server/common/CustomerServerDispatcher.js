var csskv = require('../kvs/CustomerServer');
var redis = require('redis');

var CustomerServerDispatcher = function(){
    this.customerServers = {};
    this.subscribeClient = redis.createClient();
    this.publishClient = redis.createClient();
    this.redisClientInit();
}

var prototype  = CustomerServerDispatcher.prototype;

prototype.redisClientInit = function(){
    this.subscribeClient.on('subscribe', function(){
        console.log('redis client had subscribed');
    });
    this.subscribeClient.subscribe('customer server message');
    this.subscribeClient.on('message', this.handleMessage);
}

prototype.handleMessage = function(channel, message){
    //TODO
    var msg = JSON.parse(message);
    var csId = msg.csId;
    var cs = this.getCustomerServerById(csId);
    if(cs){
        cs.emit('message', msg);
    }
};

prototype.publishMessage = function(csId, msg){
    msg.csId = csId;
    msg.customer = user;
    this.publishClient.publish('customer server message', JSON.stringify(message));
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
    var key, load = 100000;
    csskv.loadCSLoadAsync()
        .then(function(err, csLoad){
            for(k in csLoad){
                if(csLoad[k] <= load){
                    key = k;
                }
            }
            return key;
        });
}

prototype.dispatch = function(user, message, csId){
    var self = this;
    if(csId){
        return this.publishMessage(csId, user, message);
    } else {
        csskv.loadCSSByOpenIdAsync(user.wx_openid)
            .then(function(csId){
                if(csId){
                    return this.publishMessage(csId, user, message);
                }
                var csId = self.getLightLoadCustomerServerId();
                var date = new Date();
                var min = date.getMinutes();
                date = date.setMinutes(min + 30);
                var css = {
                    csId: csId,
                    expire: date
                }
                csskv.saveCSSByOpenIdAsync(user.wx_openid, css)
                    .then(function(){
                        return this.publishMessage(csId, user, message);
                    })
            })
    }
}

module.exports = CustomerServerDispatcher;