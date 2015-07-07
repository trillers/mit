/**
 * SPA definition which is the single entry of our mobile site
 */
var riot = require('seedriot');
require('./tags')();
var agent = require('./agent').init();
var util = require('./util');

var Spa = require('./spa');
var app = new Spa({defaultHash: 'timer'});


app.routeView('timer', nest.viewable({
  name: 'timer',
  mount: function(ctx){
    var tags = riot.mount('timer');
    this.tag = tags[0];
  },
  route: function(ctx){
    this.context = ctx;
    this.parent.currentTrigger('mask');
    app.history.push('timer');
    this.tag.trigger('open', ctx.req.query);
  }
}));


app.routeView('debug/index', nest.viewable({
  name: 'debug/index',
  mount: function(ctx){
    var tags = riot.mount('debug-index', {});
    this.tag = tags[0];
  },
  route: function(ctx){
    this.context = ctx;
    this.tag.trigger('open');
  }
}));

app.routeView('activity/index', nest.viewable({
  name: 'activity/index',
  mount: function(ctx){
    console.log(riot.mount('*'));
    var tags = riot.mount('activity-index', {filter: ctx.req.query, app: this.parent});
    this.tag = tags[0];
  },
  route: function(ctx){
    this.context = ctx;
    this.parent.currentTrigger('mask');
    app.history.push('activity/index');
    this.tag.trigger('open', ctx.req.query);
  }
}));

app.on('init', function(){
  var attentionUrl = util.getCookie('attentionUrl');
  var hash = attentionUrl || window.location.hash;
  hash || (hash = app.defaultHash);
  riot.route(hash);
  if(attentionUrl){
    util.setCookie('attentionUrl', "", -1);
  }
});

app.init();

module.exports = app;