// gulp
var gulp = require('gulp');

// plugins
var connect = require('gulp-connect');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var clean = require('gulp-clean');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var runSequence = require('run-sequence');
var sass = require('gulp-sass');

var mocha = require('gulp-mocha');
var util = require('gulp-util');

var DIST_DIR = 'dist';
var SASS_DIR = 'src/assets/_scss/**/*.scss';

// tasks
gulp.task('lint', function() {
  gulp.src(['./app/**/*.js', '!./app/bower_components/**'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});
gulp.task('clean', function() {
    gulp.src('./dist/*')
      .pipe(clean({force: true}));
    gulp.src('./js/bundled.js')
      .pipe(clean({force: true}));
});
gulp.task('minify-css', function() {
  var opts = {comments:true,spare:true};
  gulp.src(['./app/**/*.css', '!./app/bower_components/**'])
    .pipe(minifyCSS(opts))
    .pipe(gulp.dest('./'));
});
gulp.task('minify-js', function() {
  gulp.src(['./app/**/*.js', '!./app/bower_components/**','!.app/services/**'])
    .pipe(uglify({
      // inSourceMap:
      // outSourceMap: "app.js.map"
    }))
    .pipe(gulp.dest('./'));
});

gulp.task('copy-html-files', function () {
  gulp.src('./app/**/*.html')
    .pipe(gulp.dest('./'));
});
gulp.task('copy-images', function () {
  gulp.src('./app/images/**')
  .pipe(gulp.dest('./images'));

});

gulp.task('browserify', function() {
  gulp.src(['app/js/main.js'])
  .pipe(browserify({
    insertGlobals: true,
    debug: true
  }))
  .pipe(concat('bundled.js'))
  .pipe(gulp.dest('./app/js'));
});
gulp.task('browserifyDist', function() {
  gulp.src(['app/js/main.js'])
  .pipe(browserify({
    insertGlobals: true,
    debug: true
  }))
  .pipe(concat('bundled.js'))
  .pipe(gulp.dest('./js'));
});


gulp.task('test', function () {
    return gulp.src(['test/**/*.js'], { read: false })
        .pipe(mocha({ reporter: 'nyan' }))
        .on('error', util.log);
});
 
gulp.task('watch-test', function () {
    gulp.watch(['src/**',  'test/**'], ['test']);
});

gulp.task('sass', function() {
    return gulp.src(SASS_DIR)
        .pipe(sass())
        .pipe(gulp.dest(DIST_DIR + '/css'))
});

/*

// *** default task *** //
gulp.task('default', function() {
  runSequence(
    ['clean'],
    ['lint', 'browserify', 'connect']
  );
});
// *** build task *** //
gulp.task('build', function() {
  runSequence(
    ['clean'],
    ['lint', 'minify-css', 'browserifyDist', 'copy-html-files', 'copy-bower-components', 'copy-services', 'copy-images']
  );
});

*/
