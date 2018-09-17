'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fastGlob = require('fast-glob');

var _fastGlob2 = _interopRequireDefault(_fastGlob);

var _output = require('@lerna/output');

var _output2 = _interopRequireDefault(_output);

var _package = require('@lerna/package');

var _package2 = _interopRequireDefault(_package);

var _readRc = require('../../../helpers/read-rc');

var _readRc2 = _interopRequireDefault(_readRc);

var _packageGraph = require('@lerna/package-graph');

var _packageGraph2 = _interopRequireDefault(_packageGraph);

var _readPackage = require('../../../helpers/read-package');

var _readPackage2 = _interopRequireDefault(_readPackage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = o => {
  const { rc, contextRoot } = o;
  const packinfo = o.package;

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
  let packages = cmpPaths.map(cp => {

    let pack = (0, _readPackage2.default)(_path2.default.join(contextRoot, cp, 'package.json'));
    // warp for serialize etc.
    return new _package2.default(pack, cp, contextRoot);
  });

  // get packages graph
  packages = new _packageGraph2.default(packages, 'allDependencies', true);

  ouputUpdated({ packages, updateVersion });

  // update package
  // 'localDependencies': file: | link: resolver
  packages.forEach((() => {
    var _ref = _asyncToGenerator(function* ({ pkg, localDependencies }) {

      // update version for publish
      pkg.version = updateVersion;

      // update deps' version
      for (const [resolved] of localDependencies) {
        pkg.updateLocalDependency(resolved, updateVersion, '');
      }

      yield pkg.serialize();
    });

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  })());
};

// output message for updates


const ouputUpdated = o => {
  let { packages, updateVersion } = o;

  const changes = [];
  packages.forEach(({ pkg }) => {
    let line = ` - ${pkg.name}: ${pkg.version} => ${updateVersion}`;
    // if (pkg.private) {
    //   line += ` (${chalk.red("private")})`
    // }
    changes.push(line);
  });

  (0, _output2.default)('');
  (0, _output2.default)('Changes:');
  (0, _output2.default)(changes.join(_os2.default.EOL));
  (0, _output2.default)('');
};
module.exports = exports['default'];