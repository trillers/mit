var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify');

gulp.task('concat', ['loadtagsoriginal', 'seajscombo'], function(){
    gulp.src('web/build/js/*.js')
        .pipe(concat('indexalpha.js'))
        .pipe(gulp.dest('web/build/tmp'));
});

