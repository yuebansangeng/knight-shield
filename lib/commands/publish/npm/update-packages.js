'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _output = require('@lerna/output');

var _output2 = _interopRequireDefault(_output);

var _readRc = require('../../../helpers/read-rc');

var _readRc2 = _interopRequireDefault(_readRc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = o => {
  const { packages, version, contextRoot } = o;
  const rc = new _readRc2.default({ contextRoot });

  // default version is package
  let updateVersion = rc.get('version') || version;

  //notice
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

      // override pakcage.json
      yield pkg.serialize();
    });

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  })());
};

// from lerna source
// output message for updates


const ouputUpdated = o => {
  let { packages, updateVersion } = o;

  const changes = [];
  packages.forEach(({ pkg }) => {
    let line = ` - ${pkg.name}: ${pkg.version} => ${updateVersion}`;
    changes.push(line);
  });

  (0, _output2.default)('');
  (0, _output2.default)('Changes:');
  (0, _output2.default)(changes.join(_os2.default.EOL));
  (0, _output2.default)('');
};
module.exports = exports['default'];