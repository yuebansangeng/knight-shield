
const gulp = require('gulp')
const babel = require('gulp-babel')
const del = require('del')

const babelrcJson = {
  "presets": [ "es2015", "react", "stage-0" ],
  "plugins": [
    "transform-runtime",
    "add-module-exports",
    "transform-decorators-legacy",
    "transform-react-display-name",
    "transform-object-assign",
    "transform-class-properties",
    [ "transform-es2015-classes", { "loose": true } ],
    "transform-proto-to-assign"
  ]
}

gulp.task('default', [ 'clear', 'scripts', 'other', 'scripts-ejs' ])

// 清理lib文件夹内的文件
gulp.task('clear', function () {
  del.sync('lib')
})

// es6代码转义es5
gulp.task('scripts', function () {
  return gulp.src('src/**/*.js')
    .pipe(babel(babelrcJson))
    .pipe(gulp.dest('lib'))
})

gulp.task('scripts-ejs', function () {
  return gulp.src('src/**/*.ejs')
    .pipe(gulp.dest('lib'))
})

// 复制图片文件到lib文件夹
gulp.task('other', function () {
  // (png|jpe?g|gif|svg)
  return gulp.src([ 'src/**/*.html', 'src/**/*.json', 'src/**/*.ejs' ])
    .pipe(gulp.dest('lib'))
})
