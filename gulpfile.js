
var gulp = require('gulp');

// Configuration and plugins
var conf = require('./lean-config');

// NPM packages
var browserSync = require('browser-sync');

var tasks = {
  serve: serve,
  inject: inject
};

gulp.task('inject', tasks.inject);
gulp.task('serve', ['inject'], tasks.serve);

// Task functions

function serve(done) {
  browserSync.init({
    server: {
      baseDir: [
        conf.paths.tmp
      ],
      routes: {
        '/bower_components': 'bower_components'
      }
    },
    open: false
  });
  done();
}

function inject() {
  gulp.src(conf.paths.src + '/index.html')
    .pipe(gulp.dest(conf.paths.tmp));
}
