'use strict';

var _gulp = require('gulp');

var _gulp2 = _interopRequireDefault(_gulp);

var _gulpSass = require('gulp-sass');

var _gulpSass2 = _interopRequireDefault(_gulpSass);

var _gulpBabel = require('gulp-babel');

var _gulpBabel2 = _interopRequireDefault(_gulpBabel);

var _gulpCssbeautify = require('gulp-cssbeautify');

var _gulpCssbeautify2 = _interopRequireDefault(_gulpCssbeautify);

var _gulpReplace = require('gulp-replace');

var _gulpReplace2 = _interopRequireDefault(_gulpReplace);

var _del = require('del');

var _del2 = _interopRequireDefault(_del);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _gulpTypescript = require('@beisen/gulp-typescript');

var _gulpTypescript2 = _interopRequireDefault(_gulpTypescript);

var _hjson = require('hjson');

var _hjson2 = _interopRequireDefault(_hjson);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const tsProject = _gulpTypescript2.default.createProject(`${__dirname}/tsconfig.json`, {}, { 'context': process.cwd() });
const babelrc = _hjson2.default.parse(_fs2.default.readFileSync(`${__dirname}/babelrc.json`, 'utf-8'));

_gulp2.default.task('default', ['clear', 'scripts', 'typescript', 'style', 'images', 'fonts']);

_gulp2.default.task('watch', function () {
  _gulp2.default.watch(['src/**/*.js', 'src/**/*.ts', 'src/**/*.tsx', './src/**/*.scss', './src/**/*.css', 'src/**/*.jpeg', 'src/**/*.png', 'src/**/*.jpg', 'src/**/*.gif', 'src/**/*.svg', 'src/**/*.woff2', 'src/**/*.woff', 'src/**/*.eot', 'src/**/*.ttf', 'src/**/*.otf'], ['clear', 'scripts', 'style', 'images', 'fonts']);
});

// 清理lib文件夹内的文件
_gulp2.default.task('clear', function () {
  _del2.default.sync('lib');
});

_gulp2.default.task('scripts', function () {
  return _gulp2.default.src(['src/**/*.js']).pipe((0, _gulpBabel2.default)(babelrc)).pipe((0, _gulpReplace2.default)(/require\((['"])(.+?)(\.scss)['"]\)/g, 'require($1$2.css$1)')).pipe((0, _gulpReplace2.default)(/require\((['"])(.+?)(\.tsx?)['"]\)/g, 'require($1$2.js$1)')).pipe(_gulp2.default.dest('lib'));
});

_gulp2.default.task('typescript', _asyncToGenerator(function* () {
  return _gulp2.default.src(['src/**/*.ts', 'src/**/*.tsx']).pipe(tsProject()).pipe((0, _gulpBabel2.default)(babelrc)).pipe((0, _gulpReplace2.default)(/require\((['"])(.+?)(\.scss)['"]\)/g, 'require($1$2.css$1)')).pipe((0, _gulpReplace2.default)(/require\((['"])(.+?)(\.tsx?)['"]\)/g, 'require($1$2.js$1)')).pipe(_gulp2.default.dest('lib'));
}));

_gulp2.default.task('style', function () {
  return _gulp2.default.src(['./src/**/*.scss', './src/**/*.css']).pipe(_gulpSass2.default.sync().on('error', _gulpSass2.default.logError)).pipe((0, _gulpCssbeautify2.default)({ indent: '  ' })).pipe(_gulp2.default.dest('lib'));
});

_gulp2.default.task('images', function () {
  return _gulp2.default.src(['src/**/*.jpeg', 'src/**/*.png', 'src/**/*.jpg', 'src/**/*.gif', 'src/**/*.svg']).pipe(_gulp2.default.dest('lib'));
});

_gulp2.default.task('fonts', function () {
  return _gulp2.default.src(['src/**/*.woff2', 'src/**/*.woff', 'src/**/*.eot', 'src/**/*.ttf', 'src/**/*.otf']).pipe(_gulp2.default.dest('lib'));
});