/**
 * Detect http use agent string and generate a browser object which
 * describe what the browser is including OS, Device, PC/mobile, App
 * @param req express request object
 * @returns {{}}
 */
var detectBrowser = function(req){
    var ua = req.headers['user-agent'], browser = {};

    if (/mobile/i.test(ua))
        browser.Mobile = true;

    if (/like Mac OS X/.test(ua)) {
        browser.iOS = /CPU( iPhone)? OS ([0-9\._]+) like Mac OS X/.exec(ua)[2].replace(/_/g, '.');
        browser.iPhone = /iPhone/.test(ua);
        browser.iPad = /iPad/.test(ua);
    }

    if (/Android/.test(ua))
        browser.Android = /Android ([0-9\.]+)[\);]/.exec(ua)[1];

    if (/webOS\//.test(ua))
        browser.webOS = /webOS\/([0-9\.]+)[\);]/.exec(ua)[1];

    if (/(Intel|PPC) Mac OS X/.test(ua))
        browser.Mac = /(Intel|PPC) Mac OS X ?([0-9\._]*)[\)\;]/.exec(ua)[2].replace(/_/g, '.') || true;

    if (/Windows NT/.test(ua))
        browser.Windows = /Windows NT ([0-9\._]+)[\);]/.exec(ua)[1];

    if (/MicroMessenger/.test(ua))
        browser.MicroMessenger = true;

    return browser;
};

/**
 * TODO: apend query string
 * Get full url with path and query string from http request,
 * such as http://www.abc.com/abc/123?name=value
 * @param req express request object
 * @returns {string}
 */
var getFullUrl = function(req){
    return req.protocol + '://' + req.get('host') + req.originalUrl;
};

/**
 * Get url with path from http request,
 * such as http://www.abc.com/abc/123
 * @param req express request object
 * @returns {string}
 */
var getUrl = function(req){
    return req.protocol + '://' + req.get('host') + req.originalUrl;
};

/**
 * Get base url part from http request, such as http://www.abc.com
 * @param req express request object
 * @returns {string}
 */
var getBaseUrl = function(req){
    return req.protocol + '://' + req.get('host');
};

module.exports = {
    detectBrowser: detectBrowser,
    getFullUrl: getFullUrl,
    getUrl: getUrl,
    getBaseUrl: getBaseUrl
};