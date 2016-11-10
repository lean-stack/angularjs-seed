
var gulp = require('gulp');

// Configuration and plugins
var conf = require('./lean-config');
var plugins = require('gulp-load-plugins')();

// NPM packages
var browserSync = require('browser-sync');
var wiredep = require('wiredep').stream;

var tasks = {
  serve: serve,
  serveDist: serveDist,
  styles: styles,
  inject: inject,
  bootstrap: bootstrapFonts,
  watch: watch,
  build: build
};

gulp.task('fonts', tasks.bootstrap);
gulp.task('styles', tasks.styles);
gulp.task('inject', ['styles','fonts'], tasks.inject);
gulp.task('build', ['inject'], tasks.build);
gulp.task('watch', ['inject'], tasks.watch);
gulp.task('serve', ['inject','watch'], tasks.serve);
gulp.task('serve:dist', ['build'], tasks.serveDist);

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

function serveDist(done) {
  browserSync.init({
    server: {
      baseDir: [
        conf.paths.dist
      ]
    },
    open: false
  });
  done();
}

function inject() {
  return gulp.src(conf.paths.src + '/index.html')
    .pipe(wiredep())
    .pipe(gulp.dest(conf.paths.tmp))
    .pipe(browserSync.stream());
}

function styles() {
  return gulp.src(conf.paths.src + '/styles/*.scss')
    .pipe(wiredep())
    .pipe(plugins.sass())
    .pipe(gulp.dest(conf.paths.tmp + '/styles'));
}

function bootstrapFonts() {
  return gulp.src('bower_components/bootstrap-sass/assets/fonts/**/*.*')
    .pipe(gulp.dest(conf.paths.tmp + '/fonts'));
}

function watch(done) {
  gulp.watch([conf.paths.src + '/index.html','bower.json'], ['inject']);
  done();
}

function build() {
  return gulp.src(conf.paths.tmp + '/index.html')
    .pipe(plugins.htmlmin())                                                    // optional: {collapseWhitespace: true}
    .pipe(gulp.dest(conf.paths.dist));
}
