'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _yeomanGenerator = require('yeoman-generator');

var _yeomanGenerator2 = _interopRequireDefault(_yeomanGenerator);

var _singlePub = require('./single-pub');

var _singlePub2 = _interopRequireDefault(_singlePub);

var _logger = require('../../../helpers/logger');

var _logger2 = _interopRequireDefault(_logger);

var _collectUpdates = require('../../../helpers/collect-updates');

var _collectUpdates2 = _interopRequireDefault(_collectUpdates);

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
      const { independent, contextRoot, onlyUpdated, 'package': packinfo } = _this.options;
      const rc = new _readRc2.default({ contextRoot });

      _logger2.default.enableProgress();
      let tracker = null;

      // independent
      let cmpPaths = independent ? rc.getComponentsPath() : [contextRoot];

      // only-updated
      if (onlyUpdated) {
        cmpPaths = yield (0, _collectUpdates2.default)({
          contextRoot,
          // 'false': only need relative path, for git diff check
          'cmpPaths': independent ? rc.getComponentsPath(false) : ['.']
        });
      }

      // update moudules version first
      // after exec build statics
      new _packageGraph2.default({
        contextRoot,
        'paths': independent ? rc.getLocalModulesPath() : [contextRoot]
      }).updatePackages(null, packinfo.version);

      tracker = _logger2.default.newItem('publishing', cmpPaths.length);

      for (let i = 0; i < cmpPaths.length; i++) {

        _logger2.default.silly('publishing', cmpPaths[i]);
        tracker.completeWork(1);

        let { code, message } = yield (0, _singlePub2.default)({ 'contextRoot': cmpPaths[i] });

        if (code !== 200) {
          throw new Error(message);
        }
      }

      tracker.finish();
    })();
  }
};
module.exports = exports['default'];