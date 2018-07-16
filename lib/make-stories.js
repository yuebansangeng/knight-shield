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

var _getDemos = require('./get-demos');

var _getDemos2 = _interopRequireDefault(_getDemos);

var _hjson = require('hjson');

var _hjson2 = _interopRequireDefault(_hjson);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const cpath = process.cwd();

exports.default = options => {
  return new Promise((resolve, reject) => {

    const storybookFolderName = '.storybook';
    const {
      // 默认配置，提供给完毕使用二进制的方式调试命令使用
      storybookConfigPath = _path2.default.join(__dirname, storybookFolderName)
    } = options;

    // 获取组件的名字
    const bscpmrc = _hjson2.default.parse(_fs2.default.readFileSync(_path2.default.join(cpath, '.bscpmrc.json'), 'utf-8'));

    _ejs2.default.renderFile(_path2.default.join(storybookConfigPath, 'stories.ejs'), {
      'examples': (0, _getDemos2.default)(_path2.default.join(cpath, 'examples')),
      'name': bscpmrc.name,
      'cpath': cpath
    }, {}, // ejs options
    (err, storiesjs) => {
      if (err) throw err;
      // 在组建项目中创建配置文件
      _fs2.default.writeFile(_path2.default.join(storybookConfigPath, storybookFolderName, 'stories.js'), storiesjs, err => {
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