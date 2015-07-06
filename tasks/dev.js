var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
gulp.task('dev', ['build'], function() {
  nodemon({
    script: 'bin/www',
    watch: ['web', 'web/css', 'web/js', './', 'web'],
    ignore: ['build/']
  }).on('change', 'build');
});
