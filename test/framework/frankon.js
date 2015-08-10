function Frankon(){
    this.middlewares = [];
    this.context = {};
}
var proto = Frankon.prototype;
proto.use = function(fn){
    this.middlewares.push(fn);
};
proto.compose = function(){
    var me = this;
    var _next = function(){
        if(!me.middlewares.length) return;
        var middleware = me.middlewares.shift();
        middleware.apply(me, [].concat([1, 2], _next));
    }
    return function(){
        _next([].slice(arguments, 0, 2));
    }
};
proto.generateHandler = function(){
    var me = this;
    var entryFn = me.compose();
    return function(req, res, next){
        me.context.res = res;
        entryFn.apply(me, arguments);
    }
};

var frankon = new Frankon();
var fs = require('fs')
frankon.use(function(req, res, next){
    console.log(1)
    next();
    console.log(1)
})
frankon.use(function(req, res, next){
    console.log(2)
    next();
    console.log(5)
})
frankon.use(function(req, res, next){
    console.log(2)
})
var handler = frankon.generateHandler();
var wechat = function(token, fn){
    fn()
};
wechat("123", handler);