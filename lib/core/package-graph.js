'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _output = require('@lerna/output');

var _output2 = _interopRequireDefault(_output);

var _package = require('@lerna/package');

var _package2 = _interopRequireDefault(_package);

var _packageGraph = require('@lerna/package-graph');

var _packageGraph2 = _interopRequireDefault(_packageGraph);

var _collectUpdates = require('@lerna/collect-updates');

var _collectUpdates2 = _interopRequireDefault(_collectUpdates);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const readPackage = pckPath => _fs2.default.existsSync(pckPath) ? require(pckPath) : {};

class PkgGraph {

  constructor(props) {
    this.contextRoot = props.contextRoot;
    this.paths = props.paths;
    this.graph = this.makePackageGraph();
    this.packages = this.graph.rawPackageList;
  }

  makePackageGraph() {
    const packages = this.paths.map(cp => {
      let pack = readPackage(_path2.default.join(cp, 'package.json'));
      // warp for serialize etc.
      return new _package2.default(pack, cp, this.contextRoot);
    });
    // get graph
    return new _packageGraph2.default(packages, 'allDependencies', true);
  }

  updatePackages(version) {
    // update package
    // 'localDependencies': file: | link: resolver
    this.graph.forEach((() => {
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

  collectUpdates() {
    // rawPackageList like results
    const updatesPackages = (0, _collectUpdates2.default)(this.graph.rawPackageList, this.graph,
    // @lerna/collect-updates/lib/make-diff-predicate.js need 'cwd'
    { 'cwd': this.contextRoot }, { 'ignoreChanges': [] });
    //notice
    this.ouputUpdated(updatesPackages);
    return updatesPackages;
  }

  ouputUpdated(updatesPackages) {
    // no modules no output
    const changes = [];
    updatesPackages.forEach(({ name, version }) => {
      let line = ` - ${name}: version => ${version}`;
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