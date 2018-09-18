'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fastGlob = require('fast-glob');

var _fastGlob2 = _interopRequireDefault(_fastGlob);

var _yeomanGenerator = require('yeoman-generator');

var _yeomanGenerator2 = _interopRequireDefault(_yeomanGenerator);

var _getPackages = require('./get-packages');

var _getPackages2 = _interopRequireDefault(_getPackages);

var _updatePackages = require('./update-packages');

var _updatePackages2 = _interopRequireDefault(_updatePackages);

var _publishNpm = require('./publish-npm');

var _publishNpm2 = _interopRequireDefault(_publishNpm);

var _gitCheckout = require('./git-checkout');

var _gitCheckout2 = _interopRequireDefault(_gitCheckout);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const fgOps = { 'onlyDirectories': true };

exports.default = class extends _yeomanGenerator2.default {

  writing() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const { rc, contextRoot, onlyUpdated, independent } = _this.options;
      const { workspaces, components, privates } = rc;
      const needPublishModules = components.concat(workspaces);
      const packinfo = _this.options.package;

      // components is sub of workspaces
      // there mabe some another module which is not component，but independent npm module
      let cmpPaths = _fastGlob2.default.sync(needPublishModules, fgOps);

      if (onlyUpdated) {
        cmpPaths = yield collectUpdates({ contextRoot, independent, rc });
      }

      // private module
      // some modules do not publish
      if (privates) {
        let privateModulePaths = _fastGlob2.default.sync(privates, fgOps);
        let totalPMPaths = privateModulePaths.join(' ');
        // filter exists path
        cmpPaths = cmpPaths.filter(function (cp) {
          return !totalPMPaths.match(new RegExp(cp), 'ig');
        });
      }

      console.log(cmpPaths);

      return;

      let packages = (0, _getPackages2.default)({ cmpPaths, contextRoot });

      (0, _updatePackages2.default)({ contextRoot, packages, 'version': packinfo.version });

      yield (0, _publishNpm2.default)({ packages }).then(function () {
        return (0, _gitCheckout2.default)();
      });
    })();
  }
};
module.exports = exports['default'];