'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _package = require('@lerna/package');

var _package2 = _interopRequireDefault(_package);

var _packageGraph = require('@lerna/package-graph');

var _packageGraph2 = _interopRequireDefault(_packageGraph);

var _readPackage = require('../../../helpers/read-package');

var _readPackage2 = _interopRequireDefault(_readPackage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = o => {
  const { contextRoot, cmpPaths } = o;

  // get packages
  let packages = cmpPaths.map(cp => {
    let pack = (0, _readPackage2.default)(_path2.default.join(contextRoot, cp, 'package.json'));
    // warp for serialize etc.
    return new _package2.default(pack, cp, contextRoot);
  });

  // get packages graph
  return new _packageGraph2.default(packages, 'allDependencies', true);
};

module.exports = exports['default'];