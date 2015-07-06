var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    file = 'web/spm/build/spm/0.0.1/index.js';

gulp.task('uglify',function(){
    gulp.src(file)
        .pipe(uglify())
        .pipe(gulp.dest('web/spm/build/spm/0.0.1'))
})
