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

var _getExamples = require('./get-examples');

var _getExamples2 = _interopRequireDefault(_getExamples);

var _readRc = require('@beisen/read-rc');

var _readRc2 = _interopRequireDefault(_readRc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (options = {}) => {

  // 该函数需要同步执
  return new Promise((resolve, reject) => {
    const { storybookConfigPath, components = [] } = options;

    const storyMetas = components.map(cpath => {

      // 获取package中的配置项
      const packinfo = require(`${cpath}/package.json`);
      const examples = (0, _getExamples2.default)(cpath);
      const rc = (0, _readRc2.default)(cpath);

      // 判断是否有 README 文件
      let readme = '';
      if (_fs2.default.existsSync(`${cpath}/README.md`)) {
        readme = `require('${cpath}/README.md')`;
      }

      // 生成 storybook 需要的组件元数据
      let stories = [];
      if (!examples.length) {
        stories.push({
          'name': 'default',
          'story': {
            'component': `require('${cpath}/src')`
          }
        });
      } else {
        stories = examples.map(exp => ({
          'name': exp.name,
          'story': {
            'component': `require('${cpath}/examples/<%=demo.name%>')`
          }
        }));
      }

      return {
        'name': rc.name || packinfo.name,
        'stories': stories,
        'readme': readme
      };
    });

    _ejs2.default.renderFile(_path2.default.join(__dirname, 'stories.ejs'), { storyMetas }, {}, // ejs options
    (err, storiesjs) => {
      if (err) throw err;
      // 在组建项目中创建配置文件
      _fs2.default.writeFile(_path2.default.join(storybookConfigPath, 'stories.js'), storiesjs, err => {
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