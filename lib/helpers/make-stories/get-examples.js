'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = contextRoot => {
  const epath = _path2.default.join(contextRoot, 'examples');
  if (!_fs2.default.existsSync(epath)) return [];

  return (0, _fs.readdirSync)(epath).map(name => _path2.default.join(epath, name)).filter(source => (0, _fs.lstatSync)(epath).isDirectory()).map(name => ({ 'name': name.split('\/')[name.split('\/').length - 1] })).filter(file => !file.name.match(/^\./));
};

module.exports = exports['default'];