'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _execa = require('execa');

var _execa2 = _interopRequireDefault(_execa);

var _check = require('./check');

var _check2 = _interopRequireDefault(_check);

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _configConsumer = require('../../../core/config-consumer');

var _readRc = require('../../../core/read-rc');

var _readRc2 = _interopRequireDefault(_readRc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = o => {
  const { CMP_SERVER_HOST } = process.env;
  const { contextRoot } = o;
  const packinfo = require(_path2.default.join(contextRoot, 'package.json'));
  const rc = new _readRc2.default({ contextRoot });
  const rcJson = rc.toJSON();

  // first check
  return (0, _check2.default)({
    'module': packinfo.name,
    'name': rcJson.name,
    'team': rcJson.team
  }).then(({ code, message, data }) => {

    if (code !== 200 || !data) throw new Error(message);

    // 修改rc文件, 添加 developers
    const { stdout } = _execa2.default.sync('git', ['config', 'user.name']);
    const username = `${stdout}`.replace(/^\s+|\s+$/, '');
    rcJson.developers = [username];

    const examples = (0, _configConsumer.getExamples)(contextRoot);

    let formData = {
      'name': rcJson.name,
      'rc': JSON.stringify(rcJson),
      'version': packinfo.version,
      'package': JSON.stringify(packinfo),
      'examples': JSON.stringify(examples),
      'readme': getContentIfExists(_path2.default.join(contextRoot, 'README.md'))
    };

    if (!examples.length) {
      formData['example_code_default'] = getContentIfExists(`${__dirname}/example.ejs`);
      formData['example_css_default'] = '';
      formData.examples = JSON.stringify([{ 'name': 'default' }]);
    } else {
      examples.forEach(({ name }) => {
        formData[`example_code_${name}`] = getContentIfExists(_path2.default.join(contextRoot, 'examples', name, 'index.js'));
        formData[`example_css_${name}`] = getContentIfExists(_path2.default.join(contextRoot, 'examples', name, 'index.css'));
      });
    }

    return _requestPromise2.default.post({
      'url': `${CMP_SERVER_HOST}/users/publish`,
      'form': formData
    }).then(res => JSON.parse(res)).catch(err => {
      console.log(err);
    });
  }).catch(err => {
    console.log(err);
  });
};

const getContentIfExists = cp => {
  return _fs2.default.existsSync(cp) ? _fs2.default.readFileSync(cp, 'utf8') : '';
};
module.exports = exports['default'];