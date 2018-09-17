'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fastGlob = require('fast-glob');

var _fastGlob2 = _interopRequireDefault(_fastGlob);

var _package = require('@lerna/package');

var _package2 = _interopRequireDefault(_package);

var _yeomanGenerator = require('yeoman-generator');

var _yeomanGenerator2 = _interopRequireDefault(_yeomanGenerator);

var _readRc = require('../../../helpers/read-rc');

var _readRc2 = _interopRequireDefault(_readRc);

var _packageGraph = require('@lerna/package-graph');

var _packageGraph2 = _interopRequireDefault(_packageGraph);

var _readPackage = require('../../../helpers/read-package');

var _readPackage2 = _interopRequireDefault(_readPackage);

var _collectUpdates = require('../../../helpers/collect-updates');

var _collectUpdates2 = _interopRequireDefault(_collectUpdates);

var _makePackagesGraph = require('./make-packages-graph');

var _makePackagesGraph2 = _interopRequireDefault(_makePackagesGraph);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = class extends _yeomanGenerator2.default {
  writing() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const { rc, contextRoot, onlyUpdated } = _this.options;
      const packinfo = _this.options.package;

      // components is sub of workspaces
      // there mabe some another module which is not component，but independent npm module
      let cmpPaths = _fastGlob2.default.sync(rc.workspaces || rc.components, { 'onlyDirectories': true });

      // TODO: 
      // if (onlyUpdated) {
      // 'independent': true => get all components package
      // cmpPaths = await collectUpdates({ contextRoot, 'independent': true, rc })
      // }

      // default version is package
      let updateVersion = (0, _readRc2.default)(contextRoot).version || packinfo.version;

      // get packages
      let packages = cmpPaths.map(function (cp) {

        let pack = (0, _readPackage2.default)(_path2.default.join(contextRoot, cp, 'package.json'));
        // warp for serialize etc.
        return new _package2.default(pack, cp, contextRoot);
      });

      // get packages graph
      packages = new _packageGraph2.default(packages, 'allDependencies', true);

      // update package
      // 'localDependencies': file: | link: resolver
      packages.forEach((() => {
        var _ref = _asyncToGenerator(function* ({ pkg, localDependencies }) {

          // update version for publish
          pkg.version = updateVersion;

          // update deps' version
          for (const [depName, resolved] of localDependencies) {
            pkg.updateLocalDependency(resolved, updateVersion, '');
          }

          yield pkg.serialize().then(function () {
            console.log(`${pkg.name} updated!`);
          });
        });

        return function (_x) {
          return _ref.apply(this, arguments);
        };
      })());
    })();
  }
};
module.exports = exports['default'];