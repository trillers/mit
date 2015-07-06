/**
 * Created by RickLee on 2015/2/28.
 */
var proOrdev = true;

seajs.config({
    alias: {
        'jquery':'../../../public/components/cmd-jquery/jquery.js',
        //'zepto': '../public/components/zepto/zepto.min',
        'zepto': '../../../public/components/cmd-zepto/zepto',
        //'jqlazyload':'js/app/jquery.lazyload.js',
        'isjs':'js/app/isjs.js',
        'jssdk':'js/app/jssdk',
        'util':'js/app/util.js',
        'seedriot':'../../../public/components/cmd-riot/riot+compiler.js'
    },
    vars: {
        'mainpath':'js/app/index'
    },
    map: [
        ['','']
    ],
    preload: [
        'jquery','util','riot'
    ],
    debug: true,
    base: proOrdev?'/web':'/public',
    charset: 'utf-8'
});
seajs.use('{mainpath}',function(){
    console.info("resource loaded");
});