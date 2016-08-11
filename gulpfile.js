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
    return gulp.src(['spec/samuikit-spec.js'], { read: false })
        .pipe(mocha({ reporter: 'nyan' }))
        .on('error', util.log);
});



// *** default task *** //
gulp.task('default', function() {
  runSequence(
    ['clean'],
    ['lint'],
    ['test'],
    ['javascript'],
    ['bundle-test']
  );
});
