var path = require('path');
var gulp = require('gulp');
var rename = require('gulp-rename');
var sourceMaps = require('gulp-sourcemaps');
var less = require('gulp-less');
gulp.task('less', function() {
  gulp.src('web/less/**/index.less')
    .pipe(sourceMaps.init())
    .pipe(less())
    .pipe(sourceMaps.write())
    .pipe(rename(function(pathobj) {
      pathobj.basename = path.basename(pathobj.dirname)
      pathobj.dirname = '';
    }))
    .pipe(gulp.dest('build/css/'));
});
