var gulp = require( 'gulp' ),
    riot = require( 'gulp-riot' ),
    concat = require( 'gulp-concat' ),
    uglify = require( 'gulp-uglify' );

gulp.task('buildtags', function(){
    gulp.src('web/tag/*.html')
        .pipe( riot() )
        .pipe( uglify() )
        .pipe( concat('tagsoriginal.js') )
        .pipe( gulp.dest('web/spm/tmp') );

});
