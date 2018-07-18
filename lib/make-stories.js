'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _ejs = require('ejs');

var _ejs2 = _interopRequireDefault(_ejs);

var _hjson = require('hjson');

var _hjson2 = _interopRequireDefault(_hjson);

var _getExamples = require('@beisen/get-examples');

var _getExamples2 = _interopRequireDefault(_getExamples);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const cpath = process.cwd();

exports.default = (() => {
  var _ref = _asyncToGenerator(function* (options = {}) {

    // 该函数需要同步执
    return yield new Promise(function (resolve, reject) {
      const {
        storybookFolderName = '.storybook',
        // 默认配置，提供给完毕使用二进制的方式调试命令使用
        storybookConfigPath = _path2.default.join(__dirname, storybookFolderName)
      } = options;

      // 获取组件的名字
      const bscpmrc = _hjson2.default.parse(_fs2.default.readFileSync(_path2.default.join(cpath, '.bscpmrc.json'), 'utf-8'));

      _ejs2.default.renderFile(_path2.default.join(storybookConfigPath, 'stories.ejs'), {
        'examples': (0, _getExamples2.default)(cpath),
        'name': bscpmrc.name,
        'cpath': cpath
      }, {}, // ejs options
      function (err, storiesjs) {
        if (err) throw err;
        // 在组建项目中创建配置文件
        _fs2.default.writeFile(_path2.default.join(storybookConfigPath, 'stories.js'), storiesjs, function (err) {
          if (err) {
            console.log(err);
            return reject(false);
          }
          resolve(true);
        });
      });
    });
  });

  return function () {
    return _ref.apply(this, arguments);
  };
})();

module.exports = exports['default'];