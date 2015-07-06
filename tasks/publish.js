var gulp = require('gulp');
gulp.task('publish', function() {

  gulp.src('web/css/**')
      .pipe(gulp.dest('public/css/'));
  gulp.src('web/js/**')
      .pipe(gulp.dest('public/js/'));
});
