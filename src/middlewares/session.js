var settings = require('mit-settings').session;
var redis = require('../app/redis');
var session = require('express-session');

module.exports = function(){
    var RedisStore = require('connect-redis')(session);
    var sessionStore = new RedisStore({client : redis});
    var expires = 60000 * settings.expires;
    return session({
        store: sessionStore,
        cookie: {maxAge: expires},
        secret: settings.secretKey,
        resave: false,
        saveUninitialized: true
    });
};
