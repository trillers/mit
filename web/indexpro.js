/**
 * Created by RickLee on 2015/2/28.
 */
var proOrdev = true;

seajs.config({
    alias: {
        'jquery':'../../js/lib/jquery',
        //'zepto': '../public/components/zepto/zepto.min',
        //'zepto': '../../../public/components/cmd-zepto/zepto',
        'jqlazyload':'js/app/jquery.lazyload',
        'isjs':'js/app/is',
        'jssdk':'js/app/jssdk',
        'util':'js/app/util',
        'riot':'../../js/lib/riot.min'
    },
    vars: {
        'mainpath':'js/app/index'
    },
    map: [
        ['','']
    ],
    preload: [
        'jquery','util','jqlazyload','riot'
    ],
    debug: true,
    base: proOrdev?'/web':'/public',
    charset: 'utf-8'
});
seajs.use('{mainpath}',function(){
    console.info("resource loaded");
});
