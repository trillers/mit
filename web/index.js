/**
 * Created by RickLee on 2015/2/28.
 */
var proOrdev = true;

seajs.config({
    alias: {
        'jquery':'/web/spm/spm_modules/jquery/1.10.2/jquery.min.js',
        'zepto': '/web/spm/spm_modules/zepto/1.1.3/index.js',
        'seedriot':'/web/spm/spm_modules/seedriot/2.0.11/riot+compiler.js',
        'isjs':'/web/spm/spm_modules/is-js/0.7.1/is.min.js',
        'jssdk':'js/app/jssdk',
        'util':'js/app/util.js'
    },
    vars: {
        'mainpath':'js/app/index'
    },
    map: [
        ['','']
    ],
    preload: [
        'jquery','util','seedriot'
    ],
    debug: true,
    base: proOrdev?'/web':'/public',
    charset: 'utf-8'
});
seajs.use('{mainpath}',function(){
    console.info("resource loaded");
});