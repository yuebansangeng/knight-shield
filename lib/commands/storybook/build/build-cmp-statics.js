'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _child_process = require('child_process');

var _makeStories = require('../../../helpers/make-stories');

var _makeStories2 = _interopRequireDefault(_makeStories);

var _generateHttpHarEntry = require('../../../helpers/generate-http-har-entry');

var _generateHttpHarEntry2 = _interopRequireDefault(_generateHttpHarEntry);

var _readRc = require('@beisen/read-rc');

var _readRc2 = _interopRequireDefault(_readRc);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _fastGlob = require('fast-glob');

var _fastGlob2 = _interopRequireDefault(_fastGlob);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

_dotenv2.default.config({ 'path': _path2.default.join(__dirname, '..', '.env') });

// 统一添加前缀组件模块前缀

exports.default = (() => {
  var _ref = _asyncToGenerator(function* (o) {
    const { cpath, output } = o;
    const { 'name': module, version } = require(`${cpath}/package.json`);
    const storybookConfigPath = _path2.default.join(__dirname, '../../../', 'configs');

    // 获取rc配置文件中的配置
    let rc = (0, _readRc2.default)(cpath);

    // 组件名称
    const cname = rc.name || module;

    // 生成 stories.js 配置文件
    let components = [cpath];
    if (rc.components) {
      components = yield _fastGlob2.default.sync(rc.components, { 'onlyDirectories': true });
      components = components.map(function (p) {
        return _path2.default.join(cpath, p);
      });
    }
    (0, _makeStories2.default)({ storybookConfigPath, components });

    // 生成 https HAR 配置文件
    (0, _generateHttpHarEntry2.default)({
      // 该构建任务是jenkins调用，无法在执行指令时配置参数，只能在rc文件中获取
      'httpHARPath': rc.mock.https,
      cpath
    });

    console.log(`开始编译静态资源：${cname}/${version}`);

    // 构建
    return yield new Promise(function (resolve, reject) {
      let resmsg = [];
      let build_cp = (0, _child_process.spawn)('node', ['node_modules/.bin/build-storybook', '-c', storybookConfigPath, '-o', `${output || cpath}/storybook-static/${cname}/${version}`], {});
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
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
})();

module.exports = exports['default'];