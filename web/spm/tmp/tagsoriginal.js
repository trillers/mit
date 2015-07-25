riot.tag("accorden-item",'<div onclick="{toggleSubMenu}" data-cid="{clazz}" class="{acc_lv1_div:true, acc_lv1_div_sel:clazz === sendTo.clazzId}">{name}</div> <ul if="{showOrNot}"> <li each="{students}" onclick="{parent.sendToHandler}" data-sid="{user}"> <div class="{acc_lv2_div:true, acc_lv2_div_sel:user === parent.sendTo.userId}"> <img class="def_head" riot-src="{headUrl || \'/web/images/def-head.png\'}"> <label>{name}</label> </div> </li> </ul>',".def_head{ display: inline-block; width:32px; height:32px; } .acc >li{ float:left; background: grey; } .acc_lv1_div{ width:100%; height:40px; line-height: 40px; background: #167880; } .acc_lv1_div_sel{ background: #62a4a9 !important; } .acc li>ul>li{ float:left; height:40px; line-height: 40px; } .acc_lv2_div{ width:100%; height:40px; line-height: 40px; } .acc_lv2_div_sel{ background: #49ffe4 !important; }",function(){function t(t){var a=ClazzLoadAction.newInvocation(t.clazzId);a.onDone(function(t){e.students=t.students||[],e.showOrNot=!0,e.update()}).execute()}var e=nest.presentable(this);e.students=[],e.showOrNot=!1,e.parentTag=e.parent.parent,e.sendTo=e.parentTag.msgJson,ClazzLoadAction=domain.action("ClazzLoadAction"),MsgSingleSendAction=domain.action("MsgSingleSendAction"),MsgUserLoadAction=domain.action("MsgUserLoadAction"),this.on("mount",function(){this.opts["data-clazz"].clazz===e.sendTo.clazzId&&(e.showOrNot=!0)}),this.toggleSubMenu=function(a){e.showOrNot=!e.showOrNot,e.showOrNot&&0===e.students.length&&t({clazzId:a.currentTarget.getAttribute("data-cid")})}.bind(this),this.sendToHandler=function(t){e.sendTo.userId=t.currentTarget.getAttribute("data-sid"),e.sendTo.clazzId=t.currentTarget.parentNode.previousElementSibling.getAttribute("data-cid"),MsgUserLoadAction.execute({userId:e.sendTo.userId})}.bind(this)});
riot.tag("clazz-add",'<div if="{!hidden}"> <input type="text" name="clazzname"> <input type="button" value="添加班级" onclick="{addClazz}"> </div>',function(){function t(){riot.route("teacher/index")}var n=nest.presentable(this),i=domain.action("ClazzAddAction");this.addClazz=function(){var t={name:n.clazzname.value};i.execute(t)}.bind(this),this.on("mount",function(){i.onDone(t)}),this.on("open",function(){this.trigger("view-route-to")})});
riot.tag("clazz-card",'<span onclick="{toggleGetClazzInfo}">{name}<input type="button" onclick="{locateToSendPage}" if="{showOrNot}" value="群发消息"></span> <div if="{showOrNot}"> <div class="qrSection"><b>班级二维码:</b> <img riot-src="{getQrChannelImg()}"></div> <div class="addStuSection"> <b>学生姓名:</b> <input name="stuName" type="text"> <b>学生电话:</b> <input name="stuPhone" type="text"> <input type="button" value="添加学生" onclick="{addStudent}"> </div> <ul> <li each="{clazz.students}" onclick="{parent.toggleMsgBtn}"> <img riot-src="{headUrl}">姓名: {name} 手机: {phone} <input if="{show}" onclick="{parent.sendToUser}" type="button" value="发送信息"> </li> </ul> </div>',function(){function t(t){var a=e.newInvocation(t.clazzId);a.onDone(function(t){n.clazz={students:t.students,qrChannel:t.qrChannel},n.showOrNot=!0,n.update()}).execute()}var n=nest.presentable(this),e=domain.action("ClazzLoadAction"),a=domain.action("ClazzAddStudentAction");n.showOrNot=!1,n.msgBtnShow=!1,n.clazz={students:[],qrChannel:{}},n.clazzId=this.opts["data-id"],n.clazzBriefId=this.opts["data-clazzbriefid"],n.getQrChannelImg=function(){return this.clazz&&this.clazz.qrChannel&&this.clazz.qrChannel.ticket&&util.CONSTANT.QRURL+this.clazz.qrChannel.ticket||""}.bind(n),this.toggleMsgBtn=function(t){for(var e=0,a=n.clazz.students.length;a>e;e++)n.clazz.students[e].show=!1;t.item.show=!0}.bind(this),this.sendToUser=function(t){riot.route("msg/usr?userId="+t.item.user+"&clazzId="+n.clazzId),t.stopPropagation()}.bind(this),this.toggleGetClazzInfo=function(e){return n.showOrNot===!0?(n.showOrNot=!1,!1):(t({clazzId:e.target.parentNode.getAttribute("data-id")}),void 0)}.bind(this),this.locateToSendPage=function(t){riot.route("clazz/notifies?channel="+n.clazzId),t.stopPropagation()}.bind(this),this.addStudent=function(t){var e=a.newInvocation({clazzId:t.currentTarget.parentNode.parentNode.parentNode.getAttribute("data-id"),name:n.stuName.value,phone:n.stuPhone.value,clazzBriefId:n.clazzBriefId});e.onDone(function(t){n.clazz={students:t.students,qrChannel:t.qrChannel},n.update()}).execute(),t.stopPropagation()}.bind(this),this.on("mount",function(){})});
riot.tag("clazz-chat",'<div class="chat_card" if="{!hidden}"> <div each="{msgs}"> <div><span>{content}</span> <ul> <li each="{replies}"><span>{from}: {content}</span> <ul> <li each="{replies}">{from}: {content}</li> </ul> </li> </ul> </div> </div> <input type="text" value="" name="content"><input onclick="{publishMsg}" type="button" value="确定发送">','clazz-chat .chat_card, [riot-tag="clazz-chat"] .chat_card{ background: #f3f3f3; } clazz-chat .chat_card div, [riot-tag="clazz-chat"] .chat_card div{ background: white; margin-bottom: 10px; height: 60px; }',function(){function n(n){a.msgs=n,a.trigger("view-route-to")}function t(n){a.msgs.unshift(n),a.update()}var a=nest.presentable(this),c=domain.action("MsgInClazzLoadAction"),i=domain.action("MsgInClazzAddAction");a.msgs=[],a.clazzId="",this.publishMsg=function(){i.execute({channel:a.clazzId,content:a.content.value})}.bind(this);var e=function(n){a.clazzId=n.clazzId,c.execute({channel:n.clazzId})}.bind(a),o=function(){}.bind(a);this.on("open",function(n){e(n)}),this.on("mount",function(){c.onDone(n),i.onDone(t)}),this.on("refresh",function(){o()})});
riot.tag("clazz-notifies",'<div if="{util.teacherOrNot() && !hidden}"> <input name="content" type="text"><input onclick="{sendToClazz}" type="button" value="发送"> </div> <div class="chat_card" if="{!hidden}"> <clazz-notify class="chat_notify" each="{msgs}" msgid="{_id}"></clazz-notify> </div>','clazz-notifies .chat_card, [riot-tag="clazz-notifies"] .chat_card{ background: #ECECEC; } clazz-notifies .chat_card .chat_notify, [riot-tag="clazz-notifies"] .chat_card .chat_notify{ display: block; background: white; margin-bottom: 10px; border-bottom: 1px solid #E9E9E9; min-height: 60px; line-height: 60px; }',function(){function n(n){t.msgs=n,t.trigger("view-route-to")}var t=nest.presentable(this),i=domain.action("MsgInClazzLoadAction"),o=domain.action("MsgMassSendAction");t.msgs=[],t.channel="";var a=function(n){t.channel=n.channel,i.execute({channel:n.channel})}.bind(t),c=function(){}.bind(t);this.on("open",function(n){a(n)}),this.on("mount",function(){i.onDone(n)}),this.sendToClazz=function(n){var i=o.newInvocation({channel:t.channel,content:t.content.value});i.onDone(function(n){t.msgs.unshift(n),t.update()}).execute(),n.stopPropagation()}.bind(this),this.on("refresh",function(){c()})});
riot.tag("clazz-notify-reply",'<div onclick="{selectSendTo}"> <img riot-src="{from.headUrl}"><span>{from.name || \'匿名\'} {to}: {content}</span> </div>',function(){var t=nest.presentable(this);console.log(t.opts.data-msgfrom),this.selectSendTo=function(){}.bind(this)});
riot.tag("clazz-notify","<span>{content}</span>",'clazz-notify span:first-child, [riot-tag="clazz-notify"] span:first-child{ background: #f5f5f5; display: block; } clazz-notify .reply_to, [riot-tag="clazz-notify"] .reply_to{ display: inline-block; height:32px; background: #0055aa; color:white; line-height: 32px; padding:0px 10px; }',function(){});
riot.tag("contact-accorden",'<div class="acc"> <accorden-item each="{clazzes}" data-clazz="{this}"></accorden-item> </div>','contact-accorden .acc >li, [riot-tag="contact-accorden"] .acc >li{ float:left; background: grey; } contact-accorden .acc_lv1_div, [riot-tag="contact-accorden"] .acc_lv1_div{ width:100%; height:40px; line-height: 40px; color:white } contact-accorden .acc_lv1_div_sel, [riot-tag="contact-accorden"] .acc_lv1_div_sel{ background: #62a4a9 !important; } contact-accorden .acc li>ul>li, [riot-tag="contact-accorden"] .acc li>ul>li{ float:left; height:40px; line-height: 40px; } contact-accorden .acc_lv2_div, [riot-tag="contact-accorden"] .acc_lv2_div{ width:100%; height:40px; line-height: 40px; } contact-accorden .acc_lv2_div_sel, [riot-tag="contact-accorden"] .acc_lv2_div_sel{ background: #a0c4c9 !important; }',function(){var c=nest.presentable(this);c.msgJson=this.parent.msgJson;var t={};this.on("mount",function(){}),this.on("update",function(){t.clazzes||(c.clazzes=this.opts.clazzes)})});
riot.tag("footer-bar",'<div> <input type="button" value="添加班级" onclick="{addClazz}"> </div>',function(){nest.presentable(this);this.addClazz=function(){riot.route("clazz/add")}.bind(this),this.sendMsgs=function(){}.bind(this)});
riot.tag("msg-stu",'<div if="{!hidden}"> <input type="text" name="content"> <input onclick="{sendToStu}" type="button" value="发送"> <div class="msg_bubble_container" each="{msgs}"> <span class="{msg_bubble:true, msg_bubble_l:from.user === __page.user._id, msg_bubble_r:from.user != __page.user._id}"><span>{from.name}</span>：<span>{content}</span></span> </div> </div>','msg-stu .chat-left-container, [riot-tag="msg-stu"] .chat-left-container{ float: left; width:30%; background:#f3f3f3; height:100%; } msg-stu .chat-right-container, [riot-tag="msg-stu"] .chat-right-container{ float:right; width:70% } msg-stu .msg_bubble_container, [riot-tag="msg-stu"] .msg_bubble_container{ overflow: hidden; } msg-stu .msg_bubble, [riot-tag="msg-stu"] .msg_bubble{ display: inline-block; height:40px; line-height: 40px; padding: 0px 10px; border-radius: 10px; margin-top: 5px; color:white } msg-stu .msg_bubble_l, [riot-tag="msg-stu"] .msg_bubble_l{ background:#009926; float:left } msg-stu .msg_bubble_r, [riot-tag="msg-stu"] .msg_bubble_r{ background:#C3C3C3; float:right }',function(){var t=nest.presentable(this),n=domain.action("MsgSingleSendAction"),e=domain.action("MsgStuInitDataAction");t.sendTo={},this.on("open",function(n){t.clazzId=n.clazzId,_onOpen(),t.trigger("view-route-to")}),this.on("mount",function(){}),_onOpen=function(){e.newInvocation({clazzId:t.clazzId}).onDone(function(n){t.msgs=n.msgs,t.sendTo.userId=n.teacher.user,t.update()}).execute()}.bind(t),this.sendToStu=function(e){n.newInvocation({to:t.sendTo.userId,content:t.content.value}).onDone(function(n){console.log(n),t.msgs.unshift(n),t.update()}).execute(),e.stopPropagation()}.bind(this)});
riot.tag("msg-usr",'<div if="{!hidden}"> <div class="chat-left-container"> <contact-accorden clazzes="{clazzes}"></contact-accorden> </div> <div class="chat-right-container"> <input type="text" name="content"> <input onclick="{sendToStu}" type="button" value="发送"> <div class="msg_bubble_container" each="{msgs}"> <span class="{msg_bubble:true, msg_bubble_l:from.user === __page.user._id, msg_bubble_r:from.user != __page.user._id}"><span>{from.name}</span>：<span>{content}</span></span> </div> </div> </div>','msg-usr .chat-left-container, [riot-tag="msg-usr"] .chat-left-container{ float: left; width:30%; background:#f3f3f3; height:100%; } msg-usr .chat-right-container, [riot-tag="msg-usr"] .chat-right-container{ float:right; width:70% } msg-usr .msg_bubble_container, [riot-tag="msg-usr"] .msg_bubble_container{ overflow: hidden; } msg-usr .msg_bubble, [riot-tag="msg-usr"] .msg_bubble{ display: inline-block; height:40px; line-height: 40px; padding: 0px 10px; border-radius: 10px; margin-top: 5px; color:white } msg-usr .msg_bubble_l, [riot-tag="msg-usr"] .msg_bubble_l{ background:#009926; float:left } msg-usr .msg_bubble_r, [riot-tag="msg-usr"] .msg_bubble_r{ background:#C3C3C3; float:right }',function(){function s(s){n.msgs=s,n.update()}function t(s){n.msgs=s.msgs,n.clazzes=s.clazzes,n.update(),n.trigger("view-route-to")}var n=nest.presentable(this),e=(domain.action("MsgToUserLoadAction"),domain.action("MsgInitDataAction")),o=domain.action("MsgSingleSendAction"),a=domain.action("MsgUserLoadAction");n.msgs=[],n.clazzes=[],n.msgJson={userId:"",clazzId:""},this.sendToStu=function(s){o.newInvocation({to:n.msgJson.userId,content:n.content.value}).onDone(function(s){console.log(s),n.msgs.unshift(s),n.update()}).execute(),s.stopPropagation()}.bind(this),this.on("open",function(s){n.msgJson.userId=s.userId,n.msgJson.clazzId=s.clazzId,e.execute({clazzId:n.msgJson.clazzId,userId:n.msgJson.userId})}),this.on("mount",function(){e.onDone(t),a.onDone(s)})});
riot.tag("student-index",'<div if="{!hidden}" class="usr_index"> <div class="usr_index_top"> <img riot-src="{__page.user.wx_headimgurl || \'/web/images/def-head.png\'}"> </div> <div><label>昵称：</label>{__page.user.wx_nickname}</div> <div><label>姓名：</label>{user.name || \'匿名\'}</div> <div><label>手机：</label>{user.phone || \'您没有输入手机号哦\'}</div> <hr> <label style="display:block;margin-bottom: 10px">我的班级</label> <div each="{clazzes}" class="clazz-card" data-clazzid="{clazz}" onclick="{parent.enterClazz}"> <span>{name}</span> </div> </div>','student-index .usr_index div, [riot-tag="student-index"] .usr_index div{ margin-bottom: 5px; } student-index .clazz-card, [riot-tag="student-index"] .clazz-card{ height: 40px; line-height: 40px; background: #E9E9E9; margin-bottom: 10px; } student-index .private-msg, [riot-tag="student-index"] .private-msg{ height:48px; line-height: 48px; background: green; text-align: center; } student-index .usr_index_top, [riot-tag="student-index"] .usr_index_top{ text-align: center;height:120px;line-height: 120px;background:transparent url(\'/web/images/userinfobanner.png\') no-repeat; background:#F3F3F3; }',function(){function e(e){console.log(e),t.user=e.user,t.clazzes=e.clazzes,t.update(),t.trigger("view-route-to")}var t=nest.presentable(this),n=domain.action("ClazzFetchByStudentAction");t.clazzes=[];var i=function(){n.execute()}.bind(t),a=function(){}.bind(t);this.on("open",function(e){i(e)}),this.on("mount",function(){n.onDone(e)}),this.on("refresh",function(){a()}),this.enterClazz=function(e){riot.route("msg/stu?clazzId="+e.currentTarget.getAttribute("data-clazzid"))}.bind(this)});
riot.tag("student-signup",'<div if="{!hidden}"> <label>学生名</label><input type="text" name="studentName"><br> <label>手机</label><input type="text" name="studentPhone"><br> <input type="button" value="注册" onclick="{signUp}"> </div>',function(){function n(){riot.route("student/index")}var t=nest.presentable(this),i=domain.action("StudentSignUpAction");this.signUp=function(){i.execute({name:t.studentName.value,phone:t.studentPhone.value})}.bind(this);var e=function(){this.trigger("view-route-to")}.bind(t),o=function(){}.bind(t);this.on("open",function(n){console.info("tag activities is opening"),e(n)}),this.on("mount",function(){i.onDone(n),console.info("tag activities is mounted")}),this.on("refresh",function(){console.info("tag activity is refreshing"),o()})});
riot.tag("teacher-index",'<div if="{!hidden}"> <div class="clazzAccordion"> <clazz-card class="clazzCard" each="{clazzes}" data-clazzbriefid="{_id}" data-id="{clazz}"></clazz-card> </div> <footer-bar></footer-bar> </div>','teacher-index .clazzAccordion >.clazzCard, [riot-tag="teacher-index"] .clazzAccordion >.clazzCard{ border-bottom: 1px solid rgb(72, 92, 174); } teacher-index .clazzAccordion .clazzCard >span, [riot-tag="teacher-index"] .clazzAccordion .clazzCard >span{ height:32px; line-height:32px; display: block; padding-left:10px; background: rgb(110, 136, 240); } teacher-index .clazzAccordion .clazzCard img, [riot-tag="teacher-index"] .clazzAccordion .clazzCard img{ display: inline-block; height:48px; width:48px; } teacher-index .clazzAccordion .clazzCard >div>ul>li>img, [riot-tag="teacher-index"] .clazzAccordion .clazzCard >div>ul>li>img{ width:40px; height:40px; border-radius: 50em; margin-right: 10px; } teacher-index .clazzAccordion ul, [riot-tag="teacher-index"] .clazzAccordion ul{ overflow: hidden; } teacher-index .clazzAccordion ul>li, [riot-tag="teacher-index"] .clazzAccordion ul>li{ padding-left:10px; height:48px; line-height: 48px; } teacher-index .clazzAccordion ul>li>input, [riot-tag="teacher-index"] .clazzAccordion ul>li>input{ } teacher-index .clazzAccordion ul>li:nth-child(odd), [riot-tag="teacher-index"] .clazzAccordion ul>li:nth-child(odd){ background: #ECECEC; } teacher-index .clazzAccordion ul>li:nth-child(even), [riot-tag="teacher-index"] .clazzAccordion ul>li:nth-child(even){ background: #EFEFEF; } teacher-index .show, [riot-tag="teacher-index"] .show{ display:block !important; } teacher-index .clazzAccordion .qrSection, [riot-tag="teacher-index"] .clazzAccordion .qrSection{ height:64px; line-height: 64px; }',function(){function c(c){i.clazzes=c&&c.clazzes||{},i.update(),i.trigger("view-route-to")}var i=nest.presentable(this),e=domain.action("ClazzFetchByTeacherAction");i.clazzes=[],i.currSendTo="",i.message={sendFrom:"",sendTo:i.currSendTo,content:""};var a=function(){}.bind(i),n=function(){}.bind(i);this.on("open",function(c){e.execute(),a(c)}),this.on("mount",function(){e.onDone(c)}),this.on("refresh",function(){n()})});
riot.tag("teacher-signup",'<div if="{!hidden}"> <label>教师姓名:</label><input type="text" name="teacherName"> <br> <label>手机号码:</label><input type="text" name="teacherPhone"> <br> <input type="button" value="注册" onclick="{signUp}"> </div>',function(){function e(){riot.route("teacher/index")}var n=nest.presentable(this),t=domain.action("TeacherSignUpAction");this.signUp=function(){t.execute({name:n.teacherName.value,phone:n.teacherPhone.value})}.bind(this);var i=function(){this.trigger("view-route-to")}.bind(n),o=function(){}.bind(n);this.on("open",function(e){console.info("tag activities is opening"),i(e)}),this.on("mount",function(){t.onDone(e),console.info("tag activities is mounted")}),this.on("refresh",function(){console.info("tag activity is refreshing"),o()})});