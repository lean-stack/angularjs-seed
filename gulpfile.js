
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
  scripts: scripts,
  styles: styles,
  templates: templates,
  inject: inject,
  bootstrap: bootstrapFonts,
  watch: watch,
  build: build
};

gulp.task('fonts', tasks.bootstrap);
gulp.task('scripts', tasks.scripts);
gulp.task('styles', tasks.styles);
gulp.task('templates', tasks.templates);
gulp.task('inject', ['scripts','styles','fonts','templates'], tasks.inject);
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

  var scriptFiles = gulp.src([
    conf.paths.tmp + '/scripts/**/*.js'
  ])
    .pipe(plugins.angularFilesort());

  const options = {
    ignorePath: [conf.paths.tmp],
    addRootSlash: false
  };

  return gulp.src(conf.paths.src + '/index.html')
    .pipe(plugins.inject(scriptFiles,options))
    .pipe(wiredep())
    .pipe(gulp.dest(conf.paths.tmp))
    .pipe(browserSync.stream());
}

// Collect scripts, do linting and copy them to temp folder
function scripts() {
  return gulp.src(conf.paths.src + '/app/**/*.js')
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format())
    .pipe(gulp.dest(conf.paths.tmp + '/scripts'));
}

// Collect sass files, inject them into the base files, compile and copy to temp folder
function styles() {

  var sassOptions = {
    outputStyle: 'expanded',
    precision: 10
  };

  var sassFiles = gulp.src(conf.paths.src + '/app/**/*.scss', { read: false });
  var options = {
    transform: function(filePath) {
      filePath = filePath.replace(conf.paths.src + '/app/', '../app/');
      return '@import "' + filePath + '";';
    },
    starttag: '// inject:scss',
    endtag: '// endinject',
    addRootSlash: false
  };

  return gulp.src(conf.paths.src + '/styles/*.scss')
    .pipe(wiredep())
    .pipe(plugins.inject(sassFiles, options))
    .pipe(plugins.sass(sassOptions))
    .pipe(gulp.dest(conf.paths.tmp + '/styles'))
    .pipe(browserSync.stream());
}

function templates() {
  return gulp.src( conf.paths.src + '/app/**/*.html')
    .pipe(plugins.htmlmin())
    .pipe(gulp.dest(conf.paths.tmp + '/app'));
}

function bootstrapFonts() {
  return gulp.src('bower_components/bootstrap-sass/assets/fonts/**/*.*')
    .pipe(gulp.dest(conf.paths.tmp + '/fonts'));
}

function watch(done) {
  gulp.watch([conf.paths.src + '/index.html','bower.json'], ['inject']);
  gulp.watch([conf.paths.src + '/**/*.scss'], ['styles']);
  gulp.watch([conf.paths.src + '/**/*.js'], ['inject']);
  done();
}

function build() {
  return gulp.src(conf.paths.tmp + '/index.html')
    .pipe(plugins.htmlmin())                                                    // optional: {collapseWhitespace: true}
    .pipe(gulp.dest(conf.paths.dist));
}
