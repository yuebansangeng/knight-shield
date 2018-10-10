'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _yeomanGenerator = require('yeoman-generator');

var _yeomanGenerator2 = _interopRequireDefault(_yeomanGenerator);

var _singlePub = require('./single-pub');

var _singlePub2 = _interopRequireDefault(_singlePub);

var _logger = require('../../../helpers/logger');

var _logger2 = _interopRequireDefault(_logger);

var _readRc = require('../../../core/read-rc');

var _readRc2 = _interopRequireDefault(_readRc);

var _packageGraph = require('../../../core/package-graph');

var _packageGraph2 = _interopRequireDefault(_packageGraph);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = class extends _yeomanGenerator2.default {

  writing() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const { independent, contextRoot, onlyUpdated, username, 'package': packinfo } = _this.options;
      const rc = new _readRc2.default({ contextRoot });
      const cmpPackageGraph = _this._private_getCmpPackageGraph(rc);
      let cmpPackages = cmpPackageGraph.packages;

      _this._private_updatePackages(rc);

      // only-updated
      if (onlyUpdated) {
        cmpPackages = cmpPackageGraph.collectUpdates();
      }

      _logger2.default.enableProgress();
      let tracker = _logger2.default.newItem('publishing', cmpPackages.length);

      // publish metadata
      yield _bluebird2.default.map(cmpPackages, function ({ location }) {

        _logger2.default.silly('publishing', location);
        tracker.completeWork(1);

        return (0, _singlePub2.default)({ 'contextRoot': location, username });
      }, { 'concurrency': 3 }).then(function () {

        tracker.finish();
      }).catch(function (err) {
        return console.log(err);
      });
    })();
  }

  _private_updatePackages(rc) {
    const { contextRoot, independent, 'package': packinfo } = this.options;
    const packageGraph = new _packageGraph2.default({
      contextRoot,
      'paths': independent ? rc.getLocalModulesPath() : [contextRoot]
    });
    packageGraph.updatePackages(null, packinfo.version);
  }

  _private_getCmpPackageGraph(rc) {
    const { contextRoot, independent } = this.options;
    return new _packageGraph2.default({
      contextRoot,
      'paths': independent ? rc.getComponentsPath() : [contextRoot]
    });
  }
};
module.exports = exports['default'];