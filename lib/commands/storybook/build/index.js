'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _yeomanGenerator = require('yeoman-generator');

var _yeomanGenerator2 = _interopRequireDefault(_yeomanGenerator);

var _buildCmpStatics = require('./build-cmp-statics');

var _buildCmpStatics2 = _interopRequireDefault(_buildCmpStatics);

var _overrideConfig = require('../../../helpers/override-config');

var _overrideConfig2 = _interopRequireDefault(_overrideConfig);

var _generateHttpHarEntry = require('../../../helpers/generate-http-har-entry');

var _generateHttpHarEntry2 = _interopRequireDefault(_generateHttpHarEntry);

var _collectUpdates = require('../../../helpers/collect-updates');

var _collectUpdates2 = _interopRequireDefault(_collectUpdates);

var _logger = require('../../../helpers/logger');

var _logger2 = _interopRequireDefault(_logger);

var _readRc = require('../../../helpers/read-rc');

var _readRc2 = _interopRequireDefault(_readRc);

var _packageGraph = require('../../../helpers/package-graph');

var _packageGraph2 = _interopRequireDefault(_packageGraph);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = class extends _yeomanGenerator2.default {

  writing() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const { contextRoot, independent, onlyUpdated, 'package': packinfo } = _this.options;
      const rc = new _readRc2.default({ contextRoot });

      (0, _overrideConfig2.default)({
        contextRoot,
        'storybookConfigPath': _path2.default.join(__dirname, '../../../', 'configs')
      });

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

      // TODO: Promise.map
      for (let i = 0; i < cmpPaths.length; i++) {

        _logger2.default.silly('building', cmpPaths[i]);
        tracker.completeWork(1);

        yield (0, _buildCmpStatics2.default)({ 'contextRoot': cmpPaths[i], 'output': contextRoot });
      }

      tracker.finish();
    })();
  }
};
module.exports = exports['default'];