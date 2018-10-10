'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _yeomanGenerator = require('yeoman-generator');

var _yeomanGenerator2 = _interopRequireDefault(_yeomanGenerator);

var _buildCmpStatics = require('./build-cmp-statics');

var _buildCmpStatics2 = _interopRequireDefault(_buildCmpStatics);

var _logger = require('../../../helpers/logger');

var _logger2 = _interopRequireDefault(_logger);

var _readRc = require('../../../core/read-rc');

var _readRc2 = _interopRequireDefault(_readRc);

var _packageGraph = require('../../../core/package-graph');

var _packageGraph2 = _interopRequireDefault(_packageGraph);

var _lifecycle = require('../../../core/lifecycle');

var _lifecycle2 = _interopRequireDefault(_lifecycle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = class extends _yeomanGenerator2.default {

  writing() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const { contextRoot, independent, onlyUpdated, 'package': packinfo } = _this.options;
      const rc = new _readRc2.default({ contextRoot });
      const lifecycle = new _lifecycle2.default({ contextRoot });
      // update moudules version first
      // after exec build statics
      const packageGraph = new _packageGraph2.default({
        contextRoot,
        'paths': independent ? rc.getLocalModulesPath() : [contextRoot]
      });
      // build paths
      let cmpPaths = independent ? rc.getComponentsPath() : [contextRoot];

      packageGraph.updatePackages(null, packinfo.version);

      if (onlyUpdated) {
        // filter packages && get updates
        let filteredPackages = _this._private_getCmpPackages();
        cmpPaths = packageGraph.collectUpdates(filteredPackages);
      }

      _logger2.default.enableProgress();
      let tracker = _logger2.default.newItem('building', cmpPaths.length);

      // build statics 3
      yield _bluebird2.default.map(cmpPaths, function (cp) {
        _logger2.default.silly('building', cp);
        tracker.completeWork(1);
        return (0, _buildCmpStatics2.default)({ 'contextRoot': cp, 'output': contextRoot, lifecycle });
      },
      // must 1, because config/stories.js
      { 'concurrency': 3 }).then(function () {

        tracker.finish();
      });
    })();
  }

  _private_getCmpPackages() {
    const { contextRoot, independent } = this.options;
    const rc = new _readRc2.default({ contextRoot });
    const packageGraph = new _packageGraph2.default({
      contextRoot,
      'paths': independent ? rc.getComponentsPath() : [contextRoot]
    });
    return packageGraph.packages;
  }
};
module.exports = exports['default'];