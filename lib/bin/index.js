'use strict';

var _child_process = require('child_process');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _colorLog = require('../color-log');

var _colorLog2 = _interopRequireDefault(_colorLog);

var _makeStories = require('../make-stories');

var _makeStories2 = _interopRequireDefault(_makeStories);

var _overrideConfig = require('../override-config');

var _overrideConfig2 = _interopRequireDefault(_overrideConfig);

var _generateHttpHarEntry = require('../generate-http-har-entry');

var _generateHttpHarEntry2 = _interopRequireDefault(_generateHttpHarEntry);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _readRc = require('@beisen/read-rc');

var _readRc2 = _interopRequireDefault(_readRc);

require('colors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

_dotenv2.default.config({ 'path': _path2.default.join(__dirname, '..', '..', '.env') });

// 格式化传入参数 --port 5000 => { port: 5000 }
const argv = (0, _minimist2.default)(process.argv.slice(2));

// cpath 组件调用命令传入的路径
// 开发者可以自定义命令执行路径
let cpath = process.cwd();
if (argv['source-path']) {
  cpath = _path2.default.join(process.cwd(), argv['source-path']);
}

const storybookConfigPath = _path2.default.join(__dirname, '..', '.storybook');
const port = argv.port || '9001';

const main = (() => {
  var _ref = _asyncToGenerator(function* () {

    // 用开发者自定义配置文件，覆盖默认文件
    (0, _overrideConfig2.default)({
      'configPath': `${cpath}/.storybook`,
      'configs': ['manager-head.html', 'preview-head.html', 'addons.js', 'config.js', {
        'ori': 'webpack.config.js',
        'dest': 'webpack.extend.config.js'
      }]
    });

    (0, _overrideConfig2.default)({
      'configPath': cpath,
      'configs': ['tsconfig.json', {
        'ori': '.babelrc',
        'dest': 'babelrc.json' // 转换成json文件，不需要处理.babelrc路径
      }]
    });

    // 配置 运行环境 需要的 stories 配置问题
    const status = (0, _makeStories2.default)({ storybookConfigPath });

    // 生成 https HAR 配置文件
    // 同时支持 "参数" 和 "配置" 方式
    (0, _generateHttpHarEntry2.default)({
      'httpHARPath': (0, _readRc2.default)().mock.https,
      cpath
    });

    // 启动本地调试环境
    let cp_sytb = (0, _child_process.spawn)('node', ['node_modules/.bin/start-storybook', '-s', '.', '-p', port, '-c', _path2.default.join(storybookConfigPath)], {});
    cp_sytb.stdout.on('data', function (data) {
      return (0, _colorLog2.default)(data);
    });
    cp_sytb.stderr.on('data', function (err_data) {
      return (0, _colorLog2.default)(err_data);
    });
  });

  return function main() {
    return _ref.apply(this, arguments);
  };
})();

main();