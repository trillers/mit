/**
 * Created by Administrator on 2015/1/27.
 */
$(function(){
    //var navtop = $(".list_nav").offset().top;
    //$(window).scroll(function(){
    //    var wintop = $(window).scrollTop();
    //    if(wintop > navtop){
    //        $(".list_nav").addClass("list_nav_fixed");
    //    } else{
    //        $(".list_nav").removeClass("list_nav_fixed");
    //    }
    //});
    //$(".list_nav div").tap(function(){
    //    var showClass = $(this).attr("alt");
    //    $(".list_nav div").removeClass("click_h");
    //    $(this).addClass("click_h");
    //    $(".nav_info").hide();
    //    $("."+showClass).show();
    //});
    $("#showCatalog").live("touchstart",function(){
        var wintop = $(window).scrollTop();
        $(".body_shadow").show().css("top",wintop+"px");
        $(".xcgy_wary").show().css("top",wintop+20+"px");
        $("body").css("overflow","hidden");
        setRouteInfo();
    });
    $(".body_shadow").live("touchstart",function(){
        $(".body_shadow").hide();
        $(".xcgy_wary").hide();
        $("body").css("overflow","visible");
        $(".comments_wary").hide();
        $(".together").hide();
    });
    $(".together").live("touchstart",function(){
        $(".body_shadow").hide();
        $(".together").hide();
    });
    $(".footer .p2").live("touchstart",function(){
        var wintop = $(window).scrollTop();
        $(".comments_wary").show().css("top",wintop+30+"px");
        $(".body_shadow").show().css("top",wintop+"px");
        $("body").css("overflow","hidden");
    });
    $(".but_close_img").live("touchstart",function(){
        $(".comments_wary").hide();
        $(".body_shadow").hide();
        $("body").css("overflow","visible");
    })
    $(".footer .p3").live("touchstart",function(){
        var wintop = $(window).scrollTop();
        $(".together").show().css("top",wintop+"px");
        $(".body_shadow").show().css("top",wintop+"px");
        $("body").css("overflow","hidden");
    });
    var setRouteInfo = function(){
        var routeObj = $(".detail_pub");
        var xcgy_infoObj = $(".xcgy_wary_div2 ul li");
        //var list_navOfftop=$(".list_nav").offset().top;
        for(var i=0;i<routeObj.length;i++){
            var tops = $(routeObj[i]).offset().top;  
            $(xcgy_infoObj[i]).attr("onclick","setAffair("+tops+")");
        }
    }
    $(".footer .p1").live("touchstart click",function(){
        var travelId = $("#travelId").val();
        $.ajax({
            type:"GET",
            url:__app.settings.api.url+"/tt/_"+travelId+"/like",
            success:function(data){
                if(data.status){
                    $(".footer .p1").toggleClass("isLive");
                    $(".likesum").html(data.result);
                }
            }
        });
    });

    /**
     * POST http://boss_host/api/tt/:ttid/comment/
     *
     * __app.settings.api.url + '/tt/' + ttid + '/comment/'
     *
     * {
     *  comment: 'comment text'
     * }
     */
    //$(".comm_but").tap(function(){
    //    var commInfo = $(".comments_wary .textarea").val();
    //    var travelId = $("#travelId").val();
    //    if(commInfo){
    //        $.ajax({
    //            type:"POST",
    //            url: "/tt/"+travelId+"/comment/",
    //            data:"comment="+commInfo,
    //            dataType: 'json',
    //            success:function(data){
    //                if(data){
    //                    console.log(data);
    //                }
    //            },error:function(XMLHttpRequest, textStatus, errorThrown){
    //                console.log("sorry error："+errorThrown);
    //            },complete: function(){
    //                // Handle the complete event
    //                console.log("complete");
    //            },beforeSend: function(){
    //                // Handle the beforeSend event
    //                console.log("beforeSend");
    //            }
    //        });
    //    }
    //});

    if(window.__page.user.id){
        isLike();
    }
});
//判断是否like --travel-target
var isLike = function(){
    var travelId = $("#travelId").val();
    var isNoLike = window.__page.user.meta.likes[travelId];
    if(isNoLike){
        $(".footer .p1").addClass("isLive");
    }
}