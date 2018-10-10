'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _output = require('@lerna/output');

var _output2 = _interopRequireDefault(_output);

var _package = require('@lerna/package');

var _package2 = _interopRequireDefault(_package);

var _packageGraph = require('@lerna/package-graph');

var _packageGraph2 = _interopRequireDefault(_packageGraph);

var _readPackage = require('../helpers/read-package');

var _readPackage2 = _interopRequireDefault(_readPackage);

var _collectUpdates = require('@lerna/collect-updates');

var _collectUpdates2 = _interopRequireDefault(_collectUpdates);

var _fastGlob = require('fast-glob');

var _fastGlob2 = _interopRequireDefault(_fastGlob);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class PkgGraph {

  constructor(props) {
    this.contextRoot = props.contextRoot;
    this.paths = props.paths;
    this.packages = this.getPackages();
  }

  getPackages() {
    // get packages
    let packages = this.paths.map(cp => {
      let pack = (0, _readPackage2.default)(_path2.default.join(cp, 'package.json'));
      // warp for serialize etc.
      return new _package2.default(pack, cp, this.contextRoot);
    });
    // get packages graph
    return new _packageGraph2.default(packages, 'allDependencies', true);
  }

  updatePackages(moduleNames, version) {
    //notice
    this.ouputUpdated(moduleNames, version);
    // update package
    // 'localDependencies': file: | link: resolver
    this.packages.forEach((() => {
      var _ref = _asyncToGenerator(function* ({ pkg, localDependencies }) {
        // update version for publish
        pkg.version = version;
        // update deps' version
        for (const [resolved] of localDependencies) {
          pkg.updateLocalDependency(resolved, version, '');
        }
        // override pakcage.json
        yield pkg.serialize();
      });

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    })());
  }

  collectUpdates(filteredPackages) {
    // 
    // let includes = this.packages.map(cp => {
    //   let pack = readPackage(path.join(this.contextRoot, cp, 'package.json'))
    //   return new Package(pack, cp, this.contextRoot).name
    // })
    // let filteredPackages = filterPackages(this.packages.rawPackageList, includes, [], false)
    let updates = (0, _collectUpdates2.default)(filteredPackages.rawPackageList, this.packages,
    // @lerna/collect-updates/lib/make-diff-predicate.js need 'cwd'
    { 'cwd': this.contextRoot }, {});
    return updates.map(node => node.location);
  }

  ouputUpdated(moduleNames, version) {
    // no modules no output
    if (!moduleNames) return;
    const changes = [];

    this.packages.forEach(({ pkg }) => {
      if (!moduleNames.includes(pkg.name)) return;
      let line = ` - ${pkg.name}: ${pkg.version} => ${version}`;
      changes.push(line);
    });

    (0, _output2.default)('');
    (0, _output2.default)('Changes:');
    (0, _output2.default)(changes.join(_os2.default.EOL));
    (0, _output2.default)('');
  }
}
exports.default = PkgGraph;
module.exports = exports['default'];