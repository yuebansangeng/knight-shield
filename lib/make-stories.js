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
    const { RC_FILENAME } = process.env;
    const {
      storybookFolderName = '.storybook',
      // 默认配置，提供给完毕使用二进制的方式调试命令使用
      storybookConfigPath = _path2.default.join(__dirname, storybookFolderName)
    } = options;

    // 获取package中的配置项
    const packinfo = require(`${cpath}/package.json`);

    // 获取组件的名字
    let rc = {};
    if (_fs2.default.existsSync(`${cpath}/${RC_FILENAME}`)) {
      rc = _hjson2.default.parse(_fs2.default.readFileSync(`${cpath}/${RC_FILENAME}`, 'utf-8'));
    }

    _ejs2.default.renderFile(_path2.default.join(storybookConfigPath, 'stories.ejs'), {
      'examples': (0, _getExamples2.default)(cpath),
      'name': rc.name || packinfo.name, // 默认名称，不依赖rc文件
      'cpath': cpath
    }, {}, // ejs options
    (err, storiesjs) => {
      if (err) throw err;
      // 在组建项目中创建配置文件
      _fs2.default.writeFile(_path2.default.join(storybookConfigPath, 'stories.js'), storiesjs, err => {
        if (err) {
          console.log(err);
          return reject(false);
        }
        resolve(true);
      });
    });
  });
};

module.exports = exports['default'];