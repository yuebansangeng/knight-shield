'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _child_process = require('child_process');

var _makeStories = require('../make-stories');

var _makeStories2 = _interopRequireDefault(_makeStories);

var _generateHttpHarEntry = require('../generate-http-har-entry');

var _generateHttpHarEntry2 = _interopRequireDefault(_generateHttpHarEntry);

var _readRc = require('@beisen/read-rc');

var _readRc2 = _interopRequireDefault(_readRc);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

_dotenv2.default.config({ 'path': _path2.default.join(__dirname, '..', '..', '.env') });

// 统一添加前缀组件模块前缀
const main = (() => {
  var _ref = _asyncToGenerator(function* () {
    const cpath = process.cwd();
    const { 'name': module, version } = require(`${cpath}/package.json`);

    // 获取rc配置文件中的配置
    let rc = (0, _readRc2.default)();
    // 组件名称
    const cname = rc.name || module;

    // 生成 stories.js 配置文件
    (0, _makeStories2.default)();
    console.log(`配置文件( stories.js )生成完毕`);

    // 生成 https HAR 配置文件
    (0, _generateHttpHarEntry2.default)({
      // argv['http-har-path']:
      // 该构建任务是jenkins调用，无法在执行指令时配置参数，只能在rc文件中获取
      'httpHARPath': rc.mock.https,
      cpath
    });
    console.log(`配置文件( https.json )生成完毕`);
    console.log(`开始编译静态资源：${cname}/${version}`);

    // 构建
    let { code, message } = yield new _bluebird2.default(function (resolve, reject) {
      let resmsg = [];
      let build_cp = (0, _child_process.spawn)('node', ['node_modules/.bin/build-storybook', '-c', _path2.default.join(__dirname, '..', '.storybook'), '-o', `${cpath}/storybook-static/${cname}/${version}`], {
        'cwd': cpath
      });
      build_cp.stdout.on('data', function (data) {
        return resmsg.push(`${data}`);
      });
      build_cp.stderr.on('data', function (data) {
        return resmsg.push(`${data}`);
      });
      build_cp.on('close', function (code) {
        // 如果不join的方式输出log，会在输出信息换行时出现问题
        resolve({ code, 'message': resmsg.join('') });
      });
    });

    if (code !== 0) {
      throw new Error(message);
    } else {
      console.log(message);
    }
  });

  return function main() {
    return _ref.apply(this, arguments);
  };
})();

main();