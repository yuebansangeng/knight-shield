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

var _lifecycle = require('../../../core/lifecycle');

var _lifecycle2 = _interopRequireDefault(_lifecycle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = class extends _yeomanGenerator2.default {
  writing() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const { contextRoot, onlyUpdated, independent } = _this.options;
      const packinfo = _this.options.package;
      const rc = new _readRc2.default({ contextRoot });

      // independent
      let cmpPaths = independent ? rc.getPublishModulesPath() : [contextRoot];

      if (onlyUpdated) {
        cmpPaths = yield (0, _collectUpdates2.default)({
          contextRoot,
          // 'false': only need relative path, for git diff check
          'cmpPaths': independent ? rc.getPublishModulesPath(false) : ['.']
        });
      }

      // get packs' name for publish filter
      const publishCmpNames = cmpPaths.map(function (cp) {
        return (0, _readPackage2.default)(_path2.default.join(cp, 'package.json')).name;
      });

      const pkgGraph = new _packageGraph2.default({
        contextRoot,
        'paths': independent ? rc.getLocalModulesPath() : [contextRoot]
      });

      // TODO: update updated module
      pkgGraph.updatePackages(publishCmpNames, packinfo.version);

      // generate all local packs, for lerna update deps' version
      const localPackages = pkgGraph.getLocalPackages();

      // hooks
      const lifecycle = new _lifecycle2.default({ contextRoot });

      yield (0, _publishNpm2.default)({ localPackages, publishCmpNames, lifecycle });
      // .then(() => gitCheckout())
    })();
  }
};
module.exports = exports['default'];