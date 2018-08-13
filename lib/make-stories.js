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

var _readRc = require('@beisen/read-rc');

var _readRc2 = _interopRequireDefault(_readRc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (options = {}) => {

  // 该函数需要同步执
  return new Promise((resolve, reject) => {
    const cpath = process.cwd();
    const {
      // 默认配置，提供给完毕使用二进制的方式调试命令使用
      storybookConfigPath = _path2.default.join(__dirname, '.storybook'),
      stoiresEjsTemplatePath = _path2.default.join(__dirname, 'stories.ejs'),
      targetStoireJsPath = _path2.default.join(storybookConfigPath, 'stories.js')
    } = options;

    // 获取package中的配置项
    const packinfo = require(`${cpath}/package.json`);

    // 判断是否有 README 文件
    let hasReadme = false;
    if (_fs2.default.existsSync(`${cpath}/README.md`)) {
      hasReadme = true;
    }

    _ejs2.default.renderFile(stoiresEjsTemplatePath, {
      'examples': (0, _getExamples2.default)(cpath),
      'name': (0, _readRc2.default)().name || packinfo.name, // 默认名称，不依赖rc文件
      'cpath': cpath,
      'hasReadme': hasReadme
    }, {}, // ejs options
    (err, storiesjs) => {
      if (err) throw err;
      // 在组建项目中创建配置文件
      _fs2.default.writeFile(targetStoireJsPath, storiesjs, err => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        resolve(storiesjs);
      });
    });
  });
};

module.exports = exports['default'];