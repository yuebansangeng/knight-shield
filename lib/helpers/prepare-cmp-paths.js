'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fastGlob = require('fast-glob');

var _fastGlob2 = _interopRequireDefault(_fastGlob);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = o => {
  let { rc, contextRoot, independent } = o;

  let cmpPaths = [contextRoot];

  // 如果是 independent 模式，则使用 rc 文件中配置的 components
  if (independent) {
    if (rc.components && rc.components.length) {
      cmpPaths = _fastGlob2.default.sync(rc.components, { 'onlyDirectories': true }).map(p => _path2.default.join(contextRoot, p));
    }
  }

  return cmpPaths;
};

module.exports = exports['default'];