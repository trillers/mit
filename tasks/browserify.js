var path = require('path');
var gulp = require('gulp');
var globule = require('globule');
var watchify = require('watchify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

gulp.task('browserify', function() {
  var Bundler = global.isWatching ? watchify : browserify;
  var bundle = function() {
    globule.find(path.join(__dirname, '../web/js/**/index.js')).forEach(function(fp) {
      var entryName = path.basename(path.dirname(fp));
      Bundler({
        entries: [fp],
        debug: true
      }).bundle()
        .pipe(source(entryName + '.js'))
        .pipe(gulp.dest('./build/js/'));
    });
  }
  if (global.isWatching) {
    // Rebundle with watchify on changes.
    bundler.on('update', bundle);
  }
  return bundle();
});