// gulp
var gulp = require('gulp');

// plugins
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var runSequence = require('run-sequence');
var mocha = require('gulp-mocha');
var util = require('gulp-util');
var replace = require('gulp-replace');


// tasks
gulp.task('lint', function() {
  gulp.src(['./src/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('clean', function() {
    gulp.src('./dist/*')
      .pipe(clean({force: true}));
});

gulp.task('javascript', function() {
  return gulp.src('src/**/*.js')
    .pipe(concat('samuikit.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist'));
});

gulp.task('test', function () {
    return gulp.src(['test/**/*.js'], { read: false })
        .pipe(mocha({ reporter: 'nyan' }))
        .on('error', util.log);
});

gulp.task('watch-test', function () {
    gulp.watch(['src/**',  'test/**'], ['test']);
});

gulp.task('bundle-test', function () {
    return gulp.src(['integration-test/samuikit-spec.js'], { read: false })
        .pipe(mocha({ reporter: 'nyan' }))
        .on('error', util.log);
});

gulp.task('no-exports', function(){
  gulp.src(['dist/samuikit.js'])
    .pipe(replace('exports.', ''))
    .pipe(gulp.dest('dist/samuikit-no-exports'));
});

// *** default task *** //
gulp.task('default', function() {
  runSequence(
    ['clean'],
    ['lint'],
    ['test'],
    ['javascript'],
    ['bundle-test'],
    ['no-exports']
  );
});
