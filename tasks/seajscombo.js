var gulp = require( 'gulp' ),
    uglify = require( 'gulp-uglify' ),
    seajsCombo = require( 'gulp-seajs-combo' );

gulp.task( 'seajscombo', function(){
    return gulp.src( 'web/indexpro.js' )
        .pipe( seajsCombo({
            ignore : [ 'tags','coffee-script','babel','typescript-simple','LiveScript','jade' ] // 合并时忽略该依赖模块
        }))
        //.pipe( uglify() )
        .pipe( gulp.dest('web/build/tmp') );
});