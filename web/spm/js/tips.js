//tips插件
  function Tipsitem(bgcolor,result,index){
  	this.tipscontent = '<div index="'+index+'" class="TipsWin" style="margin:0px auto;margin-top:100px;margin-bottom:5px;width:50%;height:40px;background-color:white;border-radius:5px;box-shadow:0px 0px 3px #8a8a8a;line-height: 40px;"><span style="width: 8px;height:8px;border-radius: 50em;background-color:'+bgcolor+';display: inline-block;margin-left: 10px;margin-right:10px;"></span><label style="display:inline">'+result+'</label></div>';
	this.tipsitemindex = 0;
  };
  Tipsitem.prototype.setindex=function(x){
  	this.tipsitemindex=x;
  };
  Tipsitem.prototype.getindex=function(){
  	return this.tipsitemindex;
  };
  Tipsitem.prototype.gettipscontent=function(){
  	return this.tipscontent;
  };
  intervallive=false;
  var tipswin={
  	tipsindex:0,
  	tipsarr:[],
  	addTips:function(flag,result){
  		if(flag){
  			var tipsitem = new Tipsitem("green",result,this.tipsindex);
  		}
  		else{
  			var tipsitem = new Tipsitem("red",result,this.tipsindex);
  		}
  		tipsitem.setindex(this.tipsindex);
  		this.tipsindex++;
  		this.tipsarr.push(tipsitem);
  		var tipscontent = tipsitem.gettipscontent();
  		$("#tipswin").append(tipscontent);
  		$("#tipswin").find('div[index="'+(this.tipsindex-1).toString()+'"]').animate({
  			marginTop:"0px"
  		},'normal');
  		
  		if(!intervallive){
  			tipin = setInterval(window.removetips,2000);
  			intervallive = true;
  		}
  	}
  }
  function removetips(){
  	$("#tipswin").find('div:first-child').fadeOut('slow',function(){
  		$(this).remove();
  		tipswin.tipsarr.shift();
  		console.log(tipswin.tipsarr);
  		if(tipswin.tipsarr.length==0){
  			window.clearInterval(tipin);
  			intervallive=false;
  			tipin={};
  		}
  	});
  };