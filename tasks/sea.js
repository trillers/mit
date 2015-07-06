var gulp = require('gulp');
var transport = require("gulp-seajs-transport");
var uglify = require("gulp-uglify");

gulp.task('sea', function() {
  gulp.src('./web/js/**/*.js')
      .pipe(transport({base: './web'}))
      .pipe(uglify())
      .pipe(gulp.dest('./web/build'));
});
