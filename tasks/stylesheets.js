var gulp = require('gulp'),
    less = require('gulp-less'),
    minifycss = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename');
gulp.task('stylesheets',function(){
    gulp.src(['web/css/common.css','web/css/index.css','web/css/detali.css','web/css/new.css','web/css/travel.css','web/css/other.css'])
        .pipe(concat("style.css"))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss())
        .pipe(gulp.dest('web/css'));
});
