var csskv = require('../kvs/CustomerServer');

var CustomerServerDispatcher = function(){
    this.customerServers = {};
    this.customerServerload = {}
}

var prototype  = CustomerServerDispatcher.prototype;

prototype.registryCustomerServer = function(csId, cs){
    this.customerServers[csId] = cs;
    this.customerServerload[csId] = 0;
}

prototype.delCustomerServer = function(csId){
    delete this.customerServerload[csId];
    delete this.customerServers[csId];
}

prototype.getCustomerServerById = function(csId){
    this.customerServerload[csId]++;
    return this.customerServers[csId];
}

prototype.getLightLoadCustomerServerId = function(){
    var key, load = 0;
    var csLoad = this.customerServerload;
    for(k in csLoad){
        if(csLoad[k].load >= load){
            key = k;
        }
    }

    return key;
}

prototype.dispatch = function(user, message, csId){
    var cs;
    var self = this;
    if(csId){
        cs = self.getCustomerServerById(csId);
        return cs.emit('message', {msg:message, user:user});
    } else {
        csskv.loadCSSByOpenIdAsync(user.wx_openid)
            .then(function(csId){
                if(csId){
                    cs = self.customerServers[csId];
                    return cs.emit('message', {msg:message, user:user});
                }
                var key = self.getLightLoadCustomerServerId();
                cs = self.getCustomerServerById(key);
                csskv.saveCSSByOpendId(user.wx_openid, key)
                    .then(function(){
                        return cs.emit('message', {msg:message, user:user});
                    })
            })
    }
}

module.exports = CustomerServerDispatcher;