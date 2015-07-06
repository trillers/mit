var assert = require("assert");
var UserHelper = require('../../src/models/User').helper;

describe('User', function(){
    describe('#mergeUserInfo', function(){
        var snsUserInfo = {
            "openid": "oqSpUuDlnKxHxwZa4xylKuyxaXNM",
            "access_token": "OezXcEiiBSKSxW0eoylIeH_Rt_uANhqUuxSWbUmuaufmDpTcN8jXVxpKV5DUlekKxAEZWVZyrk_lE7dzxZlRyE-K27Tje1XKLA6FbSIk5wJCiKTL5uJ2hJzaGOsM2Xyt-c3ZO3-F2czHVSb7kueNqg",
            "refresh_token": "OezXcEiiBSKSxW0eoylIeH_Rt_uANhqUuxSWbUmuaufmDpTcN8jXVxpKV5DUlekK3aiRCySJbW3P0VR9HKUuRo8v_UU6xn9tdzPjXoIH7npdlrNmaM2YCt6nQrbxCXBGpENl1eqlZF189ICAqFdL4w",
            "scope": "snsapi_userinfo",
            "nickname": "包三哥",
            "headimgurl": "http://wx.qlogo.cn/mmopen/daI4dovUUh5o4vRrNlEeIIvmXohhDYXaQUCCYyibvq6YbcPenD1wO5arW9iabib37nu2uwATCH6CefMwkehTfzce5sP1E7MfnQc/0",
            "sex": 1,
            "country": "中国",
            "province": "北京",
            "city": "海淀",
            "privilege": []
        }
        var globalUserInfo = {
            "openid": "oqSpUuDlnKxHxwZa4xylKuyxaXNM",
            "unionid": "oqSpUuDlnKxHxwZa4xylKuyxaXNM",
            "nickname": "包三哥",
            "headimgurl": "http://wx.qlogo.cn/mmopen/daI4dovUUh5o4vRrNlEeIIvmXohhDYXaQUCCYyibvq6YbcPenD1wO5arW9iabib37nu2uwATCH6CefMwkehTfzce5sP1E7MfnQc/0",
            "sex": 1,
            "language": "zh_CN",
            "country": "中国",
            "province": "北京",
            "city": "海淀",
            "subscribe": 1,
            "subscribe_time": null
        }

        it("merge sns user info and full global user info", function(done){
            var userinfo = UserHelper.mergeUserInfo(snsUserInfo, globalUserInfo);
            console.log(userinfo);
            done();
        });
    });

});