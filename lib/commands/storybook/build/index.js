'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _yeomanGenerator = require('yeoman-generator');

var _yeomanGenerator2 = _interopRequireDefault(_yeomanGenerator);

var _buildCmpStatics = require('./build-cmp-statics');

var _buildCmpStatics2 = _interopRequireDefault(_buildCmpStatics);

var _generateHttpHarEntry = require('../../../core/generate-http-har-entry');

var _generateHttpHarEntry2 = _interopRequireDefault(_generateHttpHarEntry);

var _collectUpdates = require('../../../core/collect-updates');

var _collectUpdates2 = _interopRequireDefault(_collectUpdates);

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
      const { contextRoot, independent, onlyUpdated, 'package': packinfo } = _this.options;
      const rc = new _readRc2.default({ contextRoot });

      _logger2.default.enableProgress();
      let tracker = null;

      // independent
      let cmpPaths = independent ? rc.getComponentsPath() : [contextRoot];

      // onlyUpdated
      if (onlyUpdated) {
        cmpPaths = yield (0, _collectUpdates2.default)({
          contextRoot,
          // 'false': only need relative path, for git diff check
          'cmpPaths': independent ? rc.getComponentsPath(false) : ['.']
        });
      }

      (0, _generateHttpHarEntry2.default)({ 'httpHARPath': rc.get('mock').https, contextRoot });

      // update moudules version first
      // after exec build statics
      new _packageGraph2.default({
        contextRoot,
        'paths': independent ? rc.getLocalModulesPath() : [contextRoot]
      }).updatePackages(null, packinfo.version);

      tracker = _logger2.default.newItem('building', cmpPaths.length);

      // build statics 3
      yield _bluebird2.default.map(cmpPaths, function (cp) {

        _logger2.default.silly('building', cp);
        tracker.completeWork(1);

        return (0, _buildCmpStatics2.default)({ 'contextRoot': cp, 'output': contextRoot });
      },
      // must 1, because config/stories.js
      { 'concurrency': 3 }).then(function () {

        tracker.finish();
      });
    })();
  }
};
module.exports = exports['default'];