var gulp = require('gulp'),
    tsc = require('gulp-typescript'),
    sourcemaps = require('gulp-sourcemaps'),
    tsProject = tsc.createProject('tsconfig.json'),
    mocha = require('mocha'),
    path = require('path');

var merge = require('merge2'),
    del = require('del');

gulp.task('compile-ts', function () {
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

gulp.task('clean-ts', function (callback) {
  var typeScriptGenFiles = ['./dist/**/*.*'];
  return del(typeScriptGenFiles, callback);
});

gulp.task('test', function () {
	return gulp.src('dist/specs/**/*.spec.js', {read: false})
		.pipe(mocha({reporter: 'spec', timeout: '360000'})).once('error', () => {
            process.exit(1);
        });
});

gulp.task('default', ['clean-ts', 'compile-ts', 'test']);