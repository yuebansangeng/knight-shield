'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _execa = require('execa');

var _execa2 = _interopRequireDefault(_execa);

var _override = require('../../../helpers/override-config/override');

var _override2 = _interopRequireDefault(_override);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = o => {
  const { contextRoot } = o;
  const storybookConfigPath = _path2.default.join(__dirname, '..', '..', '..', 'configs');

  // custom configs override
  (0, _override2.default)({
    'configPath': contextRoot,
    'destinationPath': storybookConfigPath,
    'configs': ['gulpfile.js', 'tsconfig.json']
  });

  // TODO: Promise.map 10
  return (0, _execa2.default)('npx', ['gulp', '--gulpfile', _path2.default.join(__dirname, '..', '..', '..', 'configs', 'gulpfile.js'), '--cwd', contextRoot, '--colors'], { 'encoding': 'utf8' });
};

module.exports = exports['default'];