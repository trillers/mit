var gulp = require( 'gulp' ),
    riot = require( 'gulp-riot' ),
    concat = require( 'gulp-concat' ),
    uglify = require( 'gulp-uglify' ),
    Promise = require( 'bluebird' ),
    fs = Promise.promisifyAll(require('fs')),
    prefix = "var init=function(){"+
        "var riot = require('seedriot');",
    suffix = "alert('loaded complete')};module.exports = init;";

gulp.task('tagstospm', ['buildtags', 'spmcp'], function(cb){
    setTimeout(function(){
        fs.readFileAsync('web/spm/tmp/tagsoriginal.js', 'utf-8')
            .then(function(tagsdata){
                if( tagsdata && typeof tagsdata === "string" ){
                    fs.writeFile('web/spm/js/app/tags.js', prefix + tagsdata + suffix, function(err){
                        if (!err) {
                            console.log("cmdtags build successful.");
                            return cb();
                        }
                        cb(new Error("cmdtags build failed."));
                    });
                }
            })
    },3000);
});

