var userAgent = getUserAgent();
var token = getToken();
var authSetting = {
    supportAnonymous: true,
    wechatMandatory: true
};
var authBranches = [
    'pcBrowser',
    'mobileBrowser',
    'wechatBrowser',
    'qqBrowser'
];

if(!userAgent.microMessager){
    var sessionUserInfo = getSessionUserInfo();
    var userInfo = null;

    if(!sessionUserInfo){
        var userInfo = loadOrCreateUser(token);
    }
    else{
        userInfo = sessionUserInfo;
    }
    authenticate(userInfo);

    next();
}

if(!token){ //new user
    var oauthBasicInfo = goToOAuthForBasic();
    var userInfo = loadUserInfoByOpenId(oauthBasicInfo.openid);

    if(!userInfo) {
        if(oauthBasicInfo.subscribe){
            userInfo = getGlobalUserInfo();
        }
        else{
            oauthBasicInfo = goToOAuthForUserInfo();
            userInfo = getSnsUserInfo();
        }
        createUser(userInfo);
    }
    else{
        ensureUserRegistered(userInfo);
    }

    authenticate(userInfo);
    goBackToPage();
}
else{//old user
    var sessionUserInfo = getSessionUserInfo();
    var userInfo = loadUserInfoByToken(token);

    //TODO: ensure to get userinfo once user authorize with scope sns_userinfo
    //if(!sessionUserInfo){ //force to load user info
    //    userInfo = loadUserInfoByToken(token);
    //}
    //else{
    //    if(reloadFlag ){
    //        userInfo = loadUserInfoByToken(token);
    //    }
    //    else{
    //        userInfo = sessionUserInfo;
    //    }
    //}

    if(!userInfo.isRegistered() || !userInfo.hasFullUserInfo() || userInfo.needRequesting()) {
        if (userInfo.isSubscribed()) {
            newUserInfo = getGlobalUserInfo();
            updateUserInfo(userInfo, newUserInfo);
        }
        else {
            if (!userInfo.isSnsUserInfo()) {
                oauthBasicInfo = goToOAuthForUserInfo();
            }
            newUserInfo = getSnsUserInfo(oauthBasicInfo);
            updateUserInfo(userInfo, newUserInfo);
        }
    }

    authenticate(userInfo);
    goBackToPage();

}

function ensureUserRegistered(userInfo){
    if(!userInfo.isRegistered() || !userInfo.hasFullUserInfo() || userInfo.needRequesting()) {
        if (userInfo.isSubscribed()) {
            newUserInfo = getGlobalUserInfo();
            updateUserInfo(userInfo, newUserInfo);
        }
        else {
            if (!userInfo.isSnsUserInfo()) {
                oauthBasicInfo = goToOAuthForUserInfo();
            }
            newUserInfo = getSnsUserInfo(oauthBasicInfo);
            updateUserInfo(userInfo, newUserInfo);
        }
    }
}