'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fastGlob = require('fast-glob');

var _fastGlob2 = _interopRequireDefault(_fastGlob);

var _readRc = require('../../../helpers/read-rc');

var _readRc2 = _interopRequireDefault(_readRc);

var _readPackage = require('../../../helpers/read-package');

var _readPackage2 = _interopRequireDefault(_readPackage);

var _packageGraph = require('@lerna/package-graph');

var _packageGraph2 = _interopRequireDefault(_packageGraph);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = (() => {
  var _ref = _asyncToGenerator(function* (o) {
    let { contextRoot, onlyUpdated, independent } = o;
    let rc = (0, _readRc2.default)(contextRoot);

    let cmpPaths = _fastGlob2.default.sync(rc.components, { 'onlyDirectories': true });

    if (onlyUpdated) {
      // 'independent': true => get all components package
      cmpPaths = yield collectUpdates({ contextRoot, independent, rc });
    }

    let packages = cmpPaths.map(function (cp) {
      return (0, _readPackage2.default)(_path2.default.join(contextRoot, cp, 'package.json'));
    });

    return new _packageGraph2.default(packages);
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
})();

module.exports = exports['default'];