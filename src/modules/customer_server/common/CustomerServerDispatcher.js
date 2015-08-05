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

    for(k in cs){
        if(cs[k].load >= load){
            key = k;
        }
    }

    return key;
}

prototype.dispatch = function(user, message, csId){
    var cs;
    if(csId){
        cs = this.getCustomerServerById(csId);
        return cs.emit('message', {msg:message, user:user});
    } else {
        csskv.loadCSSByOpenIdAsync()
            .then(function(csId){
                if(csId){
                    cs = this.customerServers[csId];
                    return cs.emit('message', {msg:message, user:user});
                }
                var key = this.getLightLoadCustomerServerId();
                cs = this.getCustomerServerById(key);
                csskv.saveCSSByOpendId(user.wx_openid, key)
                    .then(function(){
                        return cs.emit('message', {msg:message, user:user});
                    })
            })
    }
}

module.exports = CustomerServerDispatcher;