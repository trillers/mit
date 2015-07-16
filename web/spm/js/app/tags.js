var init=function(){var riot = require('seedriot');riot.tag("clazz-add",'<div if="{!hidden}"> <input type="text" name="clazzname"> <input type="button" value="添加班级" onclick="{addClazz}"> </div>',function(){function t(){riot.route("teacher/index")}var n=nest.presentable(this),i=domain.action("ClazzAddAction");this.addClazz=function(){var t={name:n.clazzname.value};i.execute(t)}.bind(this),this.on("mount",function(){i.onDone(t)}),this.on("open",function(){this.trigger("view-route-to")})});
riot.tag("clazz-card",'<span onclick="{toggleGetClazzInfo}">{name}</span> <div if="{showOrNot}"> <div class="qrSection"><b>班级二维码:</b> <img riot-src="{getQrChannelImg()}"></div> <div class="addStuSection"> <b>学生姓名:</b> <input name="stuName" type="text"> <b>学生电话:</b> <input name="stuPhone" type="text"> <input type="button" value="添加学生" onclick="{addStudent}"> </div> <ul> <li each="{clazz.students}"><img riot-src="{headUrl}">姓名: {name} 手机: {phone}</li> </ul> </div>',function(){function t(t){var a=e.newInvocation(t.clazzId);a.onDone(function(t){n.clazz={students:t.students,qrChannel:t.qrChannel},n.showOrNot=!0,n.update()}).execute()}var n=nest.presentable(this),e=domain.action("ClazzLoadAction"),a=domain.action("ClazzAddStudentAction");n.showOrNot=!1,n.clazz={students:[],qrChannel:{}},n.clazzBriefId=this.opts["data-clazzbriefid"],n.getQrChannelImg=function(){return this.clazz&&this.clazz.qrChannel&&this.clazz.qrChannel.ticket&&util.CONSTANT.QRURL+this.clazz.qrChannel.ticket||""}.bind(n),this.toggleGetClazzInfo=function(e){return n.showOrNot===!0?(n.showOrNot=!1,!1):(t({clazzId:e.target.parentNode.getAttribute("data-id")}),void 0)}.bind(this),this.addStudent=function(t){var e=a.newInvocation({clazzId:t.currentTarget.parentNode.parentNode.parentNode.getAttribute("data-id"),name:n.stuName.value,phone:n.stuPhone.value,clazzBriefId:n.clazzBriefId});e.onDone(function(t){n.clazz={students:t.students,qrChannel:t.qrChannel},n.update()}).execute(),t.stopPropagation()}.bind(this),this.on("mount",function(){})});
riot.tag("footer-bar",'<div> <input type="button" value="添加班级" onclick="{addClazz}"> <input type="button" value="群发消息" onclick="{sendMsgs}"> </div>',function(){nest.presentable(this);this.addClazz=function(){riot.route("clazz/add")}.bind(this),this.sendMsgs=function(){}.bind(this)});
riot.tag("student-index","",function(){});
riot.tag("student-signup",'<div if="{!hidden}"> <input type="text" name="studentName"> <input type="text" name="studentPhone"> <input type="button" value="注册" onclick="{signUp}"> </div>',function(){function n(){riot.route("student/index")}var t=nest.presentable(this),i=domain.action("StudentSignUpAction");this.signUp=function(){i.execute({name:t.studentName.value,phone:t.studentPhone.value})}.bind(this);var e=function(){this.trigger("view-route-to")}.bind(t),o=function(){}.bind(t);this.on("open",function(n){console.info("tag activities is opening"),e(n)}),this.on("mount",function(){i.onDone(n),console.info("tag activities is mounted")}),this.on("refresh",function(){console.info("tag activity is refreshing"),o()})});
riot.tag("teacher-index",'<div if="{!hidden}"> <div class="clazzAccordion"> <clazz-card class="clazzCard" each="{clazzes}" data-clazzbriefid="{_id}" data-id="{clazz}"></clazz-card> </div> <footer-bar></footer-bar> </div>','teacher-index .clazzAccordion >.clazzCard, [riot-tag="teacher-index"] .clazzAccordion >.clazzCard{ border-bottom: 1px solid rgb(72, 92, 174); } teacher-index .clazzAccordion .clazzCard >span, [riot-tag="teacher-index"] .clazzAccordion .clazzCard >span{ height:32px; line-height:32px; display: block; padding-left:10px; background: rgb(110, 136, 240); } teacher-index .clazzAccordion .clazzCard img, [riot-tag="teacher-index"] .clazzAccordion .clazzCard img{ display: inline-block; height:48px; width:48px; } teacher-index .clazzAccordion .clazzCard >div>ul>li>img, [riot-tag="teacher-index"] .clazzAccordion .clazzCard >div>ul>li>img{ width:40px; height:40px; border-radius: 50em; margin-right: 10px; } teacher-index .clazzAccordion ul, [riot-tag="teacher-index"] .clazzAccordion ul{ overflow: hidden; } teacher-index .clazzAccordion ul>li, [riot-tag="teacher-index"] .clazzAccordion ul>li{ padding-left:10px; height:48px; line-height: 48px; } teacher-index .clazzAccordion ul>li>input, [riot-tag="teacher-index"] .clazzAccordion ul>li>input{ display: none; } teacher-index .clazzAccordion ul>li:nth-child(odd), [riot-tag="teacher-index"] .clazzAccordion ul>li:nth-child(odd){ background: #ECECEC; } teacher-index .clazzAccordion ul>li:nth-child(even), [riot-tag="teacher-index"] .clazzAccordion ul>li:nth-child(even){ background: #EFEFEF; } teacher-index .show, [riot-tag="teacher-index"] .show{ display:block !important; } teacher-index .clazzAccordion .qrSection, [riot-tag="teacher-index"] .clazzAccordion .qrSection{ height:64px; line-height: 64px; }',function(){function c(c){i.clazzes=c&&c.clazzes||{},i.update(),i.trigger("view-route-to")}var i=nest.presentable(this),e=domain.action("ClazzFetchByTeacherAction");i.clazzes=[],i.currSendTo="",i.message={sendFrom:"",sendTo:i.currSendTo,content:""};var a=function(){}.bind(i),n=function(){}.bind(i);this.on("open",function(c){e.execute(),a(c)}),this.on("mount",function(){e.onDone(c)}),this.on("refresh",function(){n()})});
riot.tag("teacher-signup",'<div if="{!hidden}"> <label>教师姓名:</label><input type="text" name="teacherName"> <br> <label>手机号码:</label><input type="text" name="teacherPhone"> <br> <input type="button" value="注册" onclick="{signUp}"> </div>',function(){function e(){riot.route("teacher/index")}var n=nest.presentable(this),t=domain.action("TeacherSignUpAction");this.signUp=function(){t.execute({name:n.teacherName.value,phone:n.teacherPhone.value})}.bind(this);var i=function(){this.trigger("view-route-to")}.bind(n),o=function(){}.bind(n);this.on("open",function(e){console.info("tag activities is opening"),i(e)}),this.on("mount",function(){t.onDone(e),console.info("tag activities is mounted")}),this.on("refresh",function(){console.info("tag activity is refreshing"),o()})});alert('loaded complete')};module.exports = init;