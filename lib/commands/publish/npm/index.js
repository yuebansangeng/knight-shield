'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _yeomanGenerator = require('yeoman-generator');

var _yeomanGenerator2 = _interopRequireDefault(_yeomanGenerator);

var _publishNpm = require('./publish-npm');

var _publishNpm2 = _interopRequireDefault(_publishNpm);

var _gitCheckout = require('./git-checkout');

var _gitCheckout2 = _interopRequireDefault(_gitCheckout);

var _readRc = require('../../../core/read-rc');

var _readRc2 = _interopRequireDefault(_readRc);

var _collectUpdates = require('../../../core/collect-updates');

var _collectUpdates2 = _interopRequireDefault(_collectUpdates);

var _readPackage = require('../../../helpers/read-package');

var _readPackage2 = _interopRequireDefault(_readPackage);

var _packageGraph = require('../../../core/package-graph');

var _packageGraph2 = _interopRequireDefault(_packageGraph);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = class extends _yeomanGenerator2.default {
  writing() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const { contextRoot, onlyUpdated, independent } = _this.options;
      const packinfo = _this.options.package;
      const rc = new _readRc2.default({ contextRoot });
      let modulePaths = independent ? rc.getLocalModulesPath() : [contextRoot];
      const packageGraph = new _packageGraph2.default({ contextRoot, 'paths': modulePaths });

      packageGraph.updatePackages(null, packinfo.version);

      if (onlyUpdated) {
        let filteredPackages = _this._private_getPublishPackages();
        modulesPaths = packageGraph.collectUpdates(filteredPackages);
      }

      // get packs' name for publish filter
      // const publishModuleNames = modulesPaths.map(cp => readPackage(path.join(cp, 'package.json')).name)

      // generate all local packs, for lerna update deps' version
      const localPackages = packageGraph.getLocalPackages();

      yield (0, _publishNpm2.default)({ localPackages, moduleNames });
    })();
  }

  _private_getPublishPackages() {
    const { contextRoot, independent } = this.options;
    const rc = new _readRc2.default({ contextRoot });
    const packageGraph = new _packageGraph2.default({
      contextRoot,
      'paths': independent ? rc.getPublishModulesPath() : [contextRoot]
    });
    return packageGraph.packages;
  }
};
module.exports = exports['default'];