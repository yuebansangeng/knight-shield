'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _child_process = require('child_process');

var _override = require('../../../helpers/override-config/override');

var _override2 = _interopRequireDefault(_override);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = (() => {
  var _ref = _asyncToGenerator(function* (o) {
    const { contextRoot } = o;
    const storybookConfigPath = _path2.default.join(__dirname, '..', '..', '..', 'configs');

    // 用开发者自定义配置文件，覆盖默认文件
    (0, _override2.default)({
      'configPath': contextRoot,
      'destinationPath': storybookConfigPath,
      'configs': ['gulpfile.js', 'tsconfig.json']
    });

    // 生成 lib 目录，以及内部转义好的文件
    return yield new Promise(function (resolve, reject) {
      // 执行 gulp 命令
      let cp_n = (0, _child_process.spawn)('node', ['node_modules/.bin/gulp',
      // 调整 gulpfile 配置文件的获取路径
      '--gulpfile', _path2.default.join(__dirname, '..', '..', '..', 'configs', 'gulpfile.js'),
      // 重定向 gulp 命令执行的路径到组件项目根目录
      '--cwd', contextRoot, '--colors'], { 'encoding': 'utf8' });

      // 监听返回值，close时结束
      let message = [];
      cp_n.stdout.on('data', function (data) {
        return message.push(`${data}`);
      });
      cp_n.stderr.on('data', function (err_data) {
        return message.push(`${err_data}`);
      });
      cp_n.stderr.on('close', function (code) {
        resolve({ code, 'message': message.join('') });
      });
    });
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
})();

module.exports = exports['default'];