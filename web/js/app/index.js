/**
 * SPA definition which is the single entry of our mobile site
 */
var riot = require('seedriot');
require('./tags')();
var agent = require('./agent').init();
var util = require('./util');

var Spa = require('./spa');
var app = new Spa({defaultHash: authFilter()});
function authFilter(){
  var roleBinded = JSON.parse(__page.user.roleBindOrNot || false);
  if (__page.user.role == __app.enums.UserRole.names['Teacher']){
    if(roleBinded) return 'teacher/index';
    return 'teacher/signup'
  }
  if(roleBinded) return 'student/index';
  return 'student/signup'
}

app.routeView('msg/usr', nest.viewable({
  name: 'msg/usr',
  mount: function(ctx){
    var tags = riot.mount('msg-usr');
    this.tag = tags[0];
  },
  route: function(ctx){
    this.context = ctx;
    this.parent.currentTrigger('mask');
    this.tag.trigger('open', ctx.req.query);
  }
}));
app.routeView('debug/index', nest.viewable({
  name: 'debug/index',
  mount: function(ctx){
    var tags = riot.mount('debug-index');
    this.tag = tags[0];
  },
  route: function(ctx){
    this.context = ctx;
    this.parent.currentTrigger('mask');
    this.tag.trigger('open', ctx.req.query);
  }
}));
app.routeView('msg/stu', nest.viewable({
  name: 'msg/stu',
  mount: function(ctx){
    var tags = riot.mount('msg-stu');
    this.tag = tags[0];
  },
  route: function(ctx){
    this.context = ctx;
    this.parent.currentTrigger('mask');
    this.tag.trigger('open', ctx.req.query);
  }
}));

app.routeView('teacher/signup', nest.viewable({
  name: 'teacher/signup',
  mount: function(ctx){
    var tags = riot.mount('teacher-signup');
    this.tag = tags[0];
  },
  route: function(ctx){
    this.context = ctx;
    this.parent.currentTrigger('mask');
    this.tag.trigger('open', ctx.req.query);
  }
}));

app.routeView('student/signup', nest.viewable({
  name: 'student/signup',
  mount: function(ctx){
    var tags = riot.mount('student-signup');
    this.tag = tags[0];
  },
  route: function(ctx){
    this.context = ctx;
    this.parent.currentTrigger('mask');
    this.tag.trigger('open', ctx.req.query);
  }
}));

app.routeView('student/index', nest.viewable({
  name: 'student/index',
  mount: function(ctx){
    var tags = riot.mount('student-index');
    this.tag = tags[0];
  },
  route: function(ctx){
    this.context = ctx;
    this.parent.currentTrigger('mask');
    this.tag.trigger('open', ctx.req.query);
  }
}));

app.routeView('teacher/index', nest.viewable({
  name: 'teacher/index',
  mount: function(ctx){
    var tags = riot.mount('teacher-index');
    this.tag = tags[0];
  },
  route: function(ctx){
    this.context = ctx;
    this.parent.currentTrigger('mask');
    this.tag.trigger('open', ctx.req.query);
  }
}));

app.routeView('clazz/add', nest.viewable({
  name: 'clazz/add',
  mount: function(ctx){
    var tags = riot.mount('clazz-add');
    this.tag = tags[0];
  },
  route: function(ctx){
    this.context = ctx;
    this.parent.currentTrigger('mask');
    this.tag.trigger('open', ctx.req.query);
  }
}));

app.routeView('clazz/chat', nest.viewable({
  name: 'clazz/chat',
  mount: function(ctx){
    var tags = riot.mount('clazz-chat');
    this.tag = tags[0];
  },
  route: function(ctx){
    this.context = ctx;
    this.parent.currentTrigger('mask');
    this.tag.trigger('open', ctx.req.query);
  }
}));

app.routeView('clazz/notifies', nest.viewable({
  name: 'clazz/notifies',
  mount: function(ctx){
    var tags = riot.mount('clazz-notifies');
    this.tag = tags[0];
  },
  route: function(ctx){
    this.context = ctx;
    this.parent.currentTrigger('mask');
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