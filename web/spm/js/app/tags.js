var init=function(){var riot = require('seedriot');riot.tag("clazz-add",'<div if="{!hidden}"> <input type="text" name="clazzname"> <input type="button" value="添加班级" onclick="{addClazz}"> </div>',function(){function t(){riot.route("teacher/index")}var n=nest.presentable(this),i=domain.action("ClazzAddAction");this.addClazz=function(){var t={name:n.clazzname.value};i.execute(t)}.bind(this),this.on("mount",function(){i.onDone(t)}),this.on("open",function(){this.trigger("view-route-to")})});
riot.tag("footer-bar",'<div> <input type="button" value="添加班级" onclick="{addClazz}"> </div>',function(){nest.presentable(this);this.addClazz=function(){riot.route("clazz/add")}.bind(this)});
riot.tag("teacher-index",'<div if="{!hidden}"> <ul class="clazzAccordion" onclick="{showSubMenu}"> <li each="{clazzes}" > <span>{name}</span> <ul> <li>张三<input type="button" value="send" class="{show: parent.currSendTo === name}"></li> <li>李四</li> </ul> </li> </ul> <footer-bar></footer-bar> </div>','teacher-index .clazzAccordion >li, [riot-tag="teacher-index"] .clazzAccordion >li{ border-bottom: 1px solid rgb(72, 92, 174); } teacher-index .clazzAccordion >li ul, [riot-tag="teacher-index"] .clazzAccordion >li ul{ max-height:0px; transition:max-height 0.3s ease; -moz-transition:max-height 0.3s ease; -webkit-transition:max-height 0.3s ease; -o-transition:max-height 0.3s ease; } teacher-index .clazzAccordion li >span, [riot-tag="teacher-index"] .clazzAccordion li >span{ height:32px; line-height:32px; display: block; padding-left:10px; background: rgb(110, 136, 240); } teacher-index .clazzAccordion ul, [riot-tag="teacher-index"] .clazzAccordion ul{ overflow: hidden; } teacher-index .clazzAccordion ul>li, [riot-tag="teacher-index"] .clazzAccordion ul>li{ padding-left:10px; height:32px; line-height: 32px; } teacher-index .clazzAccordion ul>li>input, [riot-tag="teacher-index"] .clazzAccordion ul>li>input{ display: none; } teacher-index .clazzAccordion ul>li:nth-child(odd), [riot-tag="teacher-index"] .clazzAccordion ul>li:nth-child(odd){ background: #ECECEC; } teacher-index .clazzAccordion ul>li:nth-child(even), [riot-tag="teacher-index"] .clazzAccordion ul>li:nth-child(even){ background: #EFEFEF; } teacher-index .hidden, [riot-tag="teacher-index"] .hidden{ max-height:500px !important; } teacher-index .show, [riot-tag="teacher-index"] .show{ display:block !important; }',function(){function e(e){console.log(e),i.clazzes=e.clazzes,i.update(),i.trigger("view-route-to")}var i=nest.presentable(this),n=domain.action("ClazzFetchByTeacherAction");i.clazzes={},i.currSendTo="",i.message={sendFrom:"",sendTo:i.currSendTo,content:""},this.showSubMenu=function(e){var n={SPAN:function(e){return $(e).siblings().toggleClass("hidden")},LI:function(){i.currSendTo="121"},INPUT:function(){alert(1)}};n[e.target.tagName](e.target)}.bind(this);var t=function(){}.bind(i),o=function(){}.bind(i);this.on("open",function(e){n.execute(),t(e)}),this.on("mount",function(){n.onDone(e),console.info("tag activities is mounted")}),this.on("refresh",function(){console.info("tag activity is refreshing"),o()})});
riot.tag("teacher-signup",'<div if="{!hidden}"> <input type="text" name="teacherName"> <input type="text" name="teacherPhone"> <input type="button" value="注册" onclick="{signUp}"> </div>',function(){function n(){riot.route("teacher/index")}var e=nest.presentable(this),t=domain.action("TeacherSignUpAction");this.signUp=function(){t.execute({name:e.teacherName.value,phone:e.teacherPhone.value})}.bind(this);var i=function(){this.trigger("view-route-to")}.bind(e),o=function(){}.bind(e);this.on("open",function(n){console.info("tag activities is opening"),i(n)}),this.on("mount",function(){t.onDone(n),console.info("tag activities is mounted")}),this.on("refresh",function(){console.info("tag activity is refreshing"),o()})});alert('loaded complete')};module.exports = init;