var init=function(){var riot = require('seedriot');riot.tag("timer",'<div if="{!hidden}"> 123 </div>',function(){var i=nest.presentable(this),n=nest.modelable({},{url:__app.settings.api.url+"/pa/"});n.on("fetch",function(){});var t=function(){}.bind(i),o=function(){}.bind(i);this.on("open",function(i){console.info("tag activities is opening"),t(i)}),this.on("mount",function(){console.info("tag activities is mounted")}),this.on("refresh",function(){console.info("tag activity is refreshing"),o()})});alert('loaded complete')};module.exports = init;