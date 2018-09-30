
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
const babelrc = Hjson.parse(fs.readFileSync(`${__dirname}/babelrc.json`, 'utf-8'))


gulp.task('default', [ 'clear', 'scripts', 'typescript', 'style', 'images', 'fonts' ])

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

gulp.task('scripts', function () {
  return gulp.src([ 'src/**/*.js' ])
    .pipe(babel(babelrc))
    .pipe(replace(/require\((['"])(.+?)(\.scss)['"]\)/g, 'require($1$2.css$1)'))
    .pipe(replace(/require\((['"])(.+?)(\.tsx?)['"]\)/g, 'require($1$2.js$1)'))
    .pipe(gulp.dest('lib'))
})

gulp.task('typescript', function () {
  return gulp.src([ 'src/**/*.ts', 'src/**/*.tsx' ])
    .pipe(tsProject())
    .pipe(babel(babelrc))
    .pipe(replace(/require\((['"])(.+?)(\.scss)['"]\)/g, 'require($1$2.css$1)'))
    .pipe(replace(/require\((['"])(.+?)(\.tsx?)['"]\)/g, 'require($1$2.js$1)'))
    .pipe(gulp.dest('lib'))
})

gulp.task('style', function () {
  return gulp.src([ './src/**/*.scss', './src/**/*.css' ])
    .pipe(sass.sync())
    .pipe(cssbeautify({ indent: '  ' }))
    .pipe(gulp.dest('lib'))
})

gulp.task('images', function () {
  return gulp.src([ 'src/**/*.jpeg', 'src/**/*.png', 'src/**/*.jpg', 'src/**/*.gif', 'src/**/*.svg' ])
    .pipe(gulp.dest('lib'))
})

gulp.task('fonts', function () {
  return gulp.src([ 'src/**/*.woff2', 'src/**/*.woff', 'src/**/*.eot', 'src/**/*.ttf', 'src/**/*.otf' ])
    .pipe(gulp.dest('lib'))
})
