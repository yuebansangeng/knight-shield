'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _yeomanGenerator = require('yeoman-generator');

var _yeomanGenerator2 = _interopRequireDefault(_yeomanGenerator);

var _child_process = require('child_process');

var _colorLog = require('./color-log');

var _colorLog2 = _interopRequireDefault(_colorLog);

var _makeStories = require('../../../helpers/make-stories');

var _makeStories2 = _interopRequireDefault(_makeStories);

var _overrideConfig = require('../../../helpers/override-config');

var _overrideConfig2 = _interopRequireDefault(_overrideConfig);

var _generateHttpHarEntry = require('../../../helpers/generate-http-har-entry');

var _generateHttpHarEntry2 = _interopRequireDefault(_generateHttpHarEntry);

var _fastGlob = require('fast-glob');

var _fastGlob2 = _interopRequireDefault(_fastGlob);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = class extends _yeomanGenerator2.default {

  writing() {
    var _this = this;

    return _asyncToGenerator(function* () {
      let { contextRoot, rc, port = '9001' } = _this.options;
      const storybookConfigPath = _path2.default.join(__dirname, '../../../', 'configs');

      // 用开发者自定义配置文件，覆盖默认文件
      (0, _overrideConfig2.default)({
        'configPath': `${contextRoot}/.storybook`,
        'destinationPath': storybookConfigPath,
        'configs': ['manager-head.html', 'preview-head.html', 'addons.js', 'config.js', {
          'ori': 'webpack.config.js',
          'dest': 'webpack.extend.config.js'
        }]
      });

      (0, _overrideConfig2.default)({
        'configPath': contextRoot,
        'destinationPath': storybookConfigPath,
        'configs': ['tsconfig.json', {
          'ori': '.babelrc',
          'dest': 'babelrc.json' // 转换成json文件，不需要处理.babelrc路径
        }]
      });

      // 获取需要展示示例的组件路径
      // 配置 运行环境 需要的 stories 配置问题
      let components = [contextRoot];
      if (rc.components) {
        components = yield _fastGlob2.default.sync(rc.components, { 'onlyDirectories': true });
        components = components.map(function (p) {
          return _path2.default.join(contextRoot, p);
        });
      }
      (0, _makeStories2.default)({ storybookConfigPath, components });

      // 生成 https HAR 配置文件
      // 同时支持 "参数" 和 "配置" 方式
      (0, _generateHttpHarEntry2.default)({
        'httpHARPath': rc.mock.https,
        contextRoot
      });

      // 启动本地调试环境
      let cp_sytb = (0, _child_process.spawn)('node', ['node_modules/.bin/start-storybook', '-s', '.', '-p', port, '-c', storybookConfigPath], {});
      cp_sytb.stdout.on('data', function (data) {
        return (0, _colorLog2.default)(data);
      });
      cp_sytb.stderr.on('data', function (err_data) {
        return (0, _colorLog2.default)(err_data);
      });
    })();
  }
};
module.exports = exports['default'];