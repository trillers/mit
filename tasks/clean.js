var gulp = require('gulp');
var clean = require('gulp-clean');
gulp.task('clean', function() {
  gulp.src('public/css', {
    read: false
  })
  .pipe(clean());
  gulp.src('public/js', {
    read: false
  })
      .pipe(clean());
});