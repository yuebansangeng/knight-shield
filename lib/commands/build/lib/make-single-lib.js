'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _execa = require('execa');

var _execa2 = _interopRequireDefault(_execa);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = o => {
  const { contextRoot, configer } = o;

  return (0, _execa2.default)('npx', ['gulp', '--gulpfile', _path2.default.join(configer.getConfigPath(), 'gulpfile.js'), '--cwd', contextRoot, '--colors'], {
    'encoding': 'utf8',
    'stdout': 'inherit'
  });
};

module.exports = exports['default'];