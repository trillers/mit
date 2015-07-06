var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    exec = require('child_process').exec;

gulp.task('spmcp',function(){
    var spmStream = gulp.src(['web/js/**/*.js'])
        .pipe(gulp.dest('web/spm/js'));
    console.log('spm jss is copyed.');
    return spmStream;
});

gulp.task('spm', ['tagstospm'],function(cb){
    exec('cd web/spm/ && spm build --debug', function(err){
        if (err !== null) {
            console.log('Failed to build spm, exec error: ' + error);
            return cb(err);
        }
        console.log('spm builded.');
        cb();
    })
});



