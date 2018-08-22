
import gulp from 'gulp'
import sass from 'gulp-sass'
import babel from 'gulp-babel'
import cssbeautify from 'gulp-cssbeautify'
import replace from 'gulp-replace'
import del from 'del'
import fs from 'fs'
import path from 'path'
import ts from "@beisen/gulp-typescript"
import Hjson from 'hjson'


const tsProject = ts.createProject(`${__dirname}/tsconfig.json`, {}, { 'context': process.cwd() })

// 通过 hjson 可以转换一些有 注释
// 不标准的 json 文件到 Json object
const babelrc = Hjson.parse(fs.readFileSync(`${__dirname}/babelrc.json`, 'utf-8'))


gulp.task('default', [ 'clear', 'scripts', 'typescript', 'style', 'images', 'fonts' ])

// 监控
// npm run demo 会地调用到这里的watch任务
gulp.task('watch', function () {
  gulp.watch([ 'src/**/*.js', 'src/**/*.ts', 'src/**/*.tsx',
  './src/**/*.scss', './src/**/*.css',
  'src/**/*.jpeg', 'src/**/*.png', 'src/**/*.jpg', 'src/**/*.gif', 'src/**/*.svg',
  'src/**/*.woff2', 'src/**/*.woff', 'src/**/*.eot', 'src/**/*.ttf', 'src/**/*.otf' ],
  [ 'clear', 'scripts', 'style', 'images', 'fonts' ])
})

// 清理lib文件夹内的文件
gulp.task('clear', function () {
  del.sync('lib')
})

// es6代码转义es5
gulp.task('scripts', function () {
  return gulp.src([ 'src/**/*.js' ])
    // babel es5
    .pipe(babel(babelrc))
    // 替换 js 文件中引用的 .scss 后缀为 .css
    .pipe(replace(/require\((['"])(.+?)(\.scss)['"]\)/g, 'require($1$2.css$1)'))
    // 替换 tsx? 为 js
    .pipe(replace(/require\((['"])(.+?)(\.tsx?)['"]\)/g, 'require($1$2.js$1)'))
    .pipe(gulp.dest('lib'))
})

// es6代码转义es5
gulp.task('typescript', async function () {
  return gulp.src([ 'src/**/*.ts', 'src/**/*.tsx' ])
    // 解析 typescript 语法
    .pipe(tsProject())
    // babel es5
    .pipe(babel(babelrc))
    // 替换 js 文件中引用的 .scss 后缀为 .css
    .pipe(replace(/require\((['"])(.+?)(\.scss)['"]\)/g, 'require($1$2.css$1)'))
    // 替换 tsx? 为 js
    .pipe(replace(/require\((['"])(.+?)(\.tsx?)['"]\)/g, 'require($1$2.js$1)'))
    .pipe(gulp.dest('lib'))
})

// 解析scss文件到css
gulp.task('style', function () {
  return gulp.src([ './src/**/*.scss', './src/**/*.css' ])
    .pipe(sass.sync().on('error', sass.logError))
    // 缩进2个空格
    .pipe(cssbeautify({ indent: '  ' }))
    .pipe(gulp.dest('lib'))
})

// 复制图片文件到lib文件夹
gulp.task('images', function () {
  // (png|jpe?g|gif|svg)
  return gulp.src([ 'src/**/*.jpeg', 'src/**/*.png', 'src/**/*.jpg', 'src/**/*.gif', 'src/**/*.svg' ])
    .pipe(gulp.dest('lib'))
})

// 复制字体文件到lib文件夹
gulp.task('fonts', function () {
  // (woff2?|eot|ttf|otf)
  return gulp.src([ 'src/**/*.woff2', 'src/**/*.woff', 'src/**/*.eot', 'src/**/*.ttf', 'src/**/*.otf' ])
    .pipe(gulp.dest('lib'))
})
