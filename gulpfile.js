var gulp = require('gulp'),
    tsc = require('gulp-typescript'),
    sourcemaps = require('gulp-sourcemaps'),
    tsProject = tsc.createProject('tsconfig.json'),
    jasmine = require('gulp-jasmine');
    path = require('path');

var merge = require('merge2'),
    del = require('del');

gulp.task('clean-ts', function (callback) {
  var typeScriptGenFiles = ['./dist/**/*.*'];
  return del(typeScriptGenFiles, callback);
});    

gulp.task('compile-ts', ['clean-ts'], function () {
    var tsResult = tsProject.src()
    .pipe(sourcemaps.init())
    .pipe(tsc(tsProject));

    return merge([
        tsResult.dts.pipe(gulp.dest('dist')),
        tsResult.js.pipe(sourcemaps.write('.', {
            includeContent: false,
            sourceRoot: function (file) {
                var sourceFile = path.join(file.cwd, file.sourceMap.file);
                return "../" + path.relative(path.dirname(sourceFile), __dirname);
            }
        })).pipe(gulp.dest('dist'))
    ]);
});

gulp.task('test', ['compile-ts'], function () {
	return gulp.src('./dist/specs/**/*.specs.js')
        .pipe(jasmine());
});

gulp.task('default', ['clean-ts', 'compile-ts', 'test']);