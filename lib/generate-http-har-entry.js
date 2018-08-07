'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = o => {
  let {
    httpHARPath,
    destinationPath = _path2.default.join(__dirname, 'http-mock', 'https.json'),
    cpath
  } = o;

  // 根据外部传入的 http hars 相对路径，生成绝对路径
  if (httpHARPath) {
    httpHARPath = _path2.default.join(cpath, httpHARPath);
  } else {
    httpHARPath = cpath;
  }

  // 为找到指定配置文件所在的文件路径
  if (!_fs2.default.existsSync(httpHARPath)) {
    return false;
  }

  let entries = [];
  _fs2.default.readdirSync(httpHARPath).filter(filename => !filename.match(/^\./)).forEach(filename => {
    const harHttpJson = require(_path2.default.join(httpHARPath, filename));
    entries.push(harHttpJson);
  });

  _fs2.default.writeFileSync(destinationPath, JSON.stringify({
    'log': {
      'version': '0.0.1',
      'creator': {
        'name': '@beisen/http-mocker',
        'version': '0.0.1'
      },
      'pages': {},
      'entries': entries
    }
  }, null, 2), 'utf8');
};

module.exports = exports['default'];