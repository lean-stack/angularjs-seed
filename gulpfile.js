
var gulp = require('gulp');

// Configuration and plugins
var conf = require('./lean-config');
var plugins = require('gulp-load-plugins')();

// NPM packages
var browserSync = require('browser-sync');

var tasks = {
  serve: serve,
  inject: inject,
  watch: watch,
  build: build
};

gulp.task('inject', tasks.inject);
gulp.task('build', ['inject'], tasks.build);
gulp.task('watch', ['inject'], tasks.watch);
gulp.task('serve', ['inject','watch'], tasks.serve);

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
    .pipe(gulp.dest(conf.paths.tmp))
    .pipe(browserSync.stream());
}

function watch(done) {
  gulp.watch(conf.paths.src + '/index.html', ['inject']);
  done();
}

function build() {
  return gulp.src(conf.paths.tmp + '/index.html')
    .pipe(plugins.htmlmin())                                                    // optional: {collapseWhitespace: true}
    .pipe(gulp.dest(conf.paths.dist));
}
