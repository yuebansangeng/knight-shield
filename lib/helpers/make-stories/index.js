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

var _getExamples = require('./get-examples');

var _getExamples2 = _interopRequireDefault(_getExamples);

var _readRc = require('../read-rc');

var _readRc2 = _interopRequireDefault(_readRc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (options = {}) => {

  return new Promise((resolve, reject) => {

    const { storybookConfigPath, cmpPaths = [] } = options;

    const storyMetas = cmpPaths.map(contentRoot => {

      const packinfo = require(`${contentRoot}/package.json`);
      const examples = (0, _getExamples2.default)(contentRoot);
      const rc = new _readRc2.default({ contentRoot });

      let readme = '';
      if (_fs2.default.existsSync(`${contentRoot}/README.md`)) {
        readme = `require('${contentRoot}/README.md')`;
      }

      let stories = [];
      if (!examples.length) {
        stories.push({
          'name': 'default',
          'story': {
            'component': `require('${contentRoot}/src')`
          }
        });
      } else {
        stories = examples.map(exp => ({
          'name': exp.name,
          'story': {
            'component': `require('${contentRoot}/examples/${exp.name}')`
          }
        }));
      }

      return {
        'name': rc.get('name'),
        'stories': stories,
        'readme': readme
      };
    });

    _ejs2.default.renderFile(_path2.default.join(__dirname, 'stories.ejs'), { storyMetas }, {}, (err, storiesjs) => {
      if (err) throw err;
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