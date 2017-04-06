var gulp = require('gulp');
var include = require('gulp-include');
var merge = require('merge-stream');
var runSequence = require('run-sequence');
var chmod = require('gulp-chmod');
var babel = require('gulp-babel');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

var JS_SRC = './src/*.js';
var JS_DEST = ['./'];

gulp.task('scripts', function () {
    var _merge = new merge();

    JS_DEST.forEach(function (dir) {
        _merge.add(gulp.src(JS_SRC)
            .pipe(include())
            .pipe(chmod(777))
            .pipe(babel()).on('error', function (err) {
                console.log('[Compilation Error]');
                console.log(err.fileName + (err.loc ? `( ${err.loc.line}, ${err.loc.columns} ): ` : ': '));
                console.log('error Babel: ' + err.message + '\n');
                console.log(err.codeFrame);
                this.emit('end');
            })
            .pipe(gulp.dest(dir))
            .pipe(uglify().on('error', e => {
                console.log(e);
            }))
            .pipe(rename({
                suffix: '.min'
            }))
            .pipe(gulp.dest(dir)));
    });

    return _merge;
});


gulp.task('build', function (callback) {
    runSequence(['scripts'], callback);
});
gulp.task('default', ['build']);
gulp.task('watch', ['build'], function () {
    gulp.watch(JS_SRC, ['scripts']);
});