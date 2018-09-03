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

var _prepareCmpPaths = require('../../../helpers/prepare-cmp-paths');

var _prepareCmpPaths2 = _interopRequireDefault(_prepareCmpPaths);

var _logger = require('../../../helpers/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = class extends _yeomanGenerator2.default {

  writing() {
    var _this = this;

    return _asyncToGenerator(function* () {
      let { rc, contextRoot, independent, output = contextRoot } = _this.options;

      (0, _overrideConfig2.default)({
        contextRoot,
        'storybookConfigPath': _path2.default.join(__dirname, '../../../', 'configs')
      });

      _logger2.default.enableProgress();
      let tracker = null;

      let cmpPaths = (0, _prepareCmpPaths2.default)({ contextRoot, independent, rc });

      (0, _generateHttpHarEntry2.default)({ 'httpHARPath': rc.mock.https, contextRoot });

      tracker = _logger2.default.newItem('building', cmpPaths.length);

      for (let i = 0; i < cmpPaths.length; i++) {

        _logger2.default.silly('building', cmpPaths[i]);
        tracker.completeWork(1);

        yield (0, _buildCmpStatics2.default)({ 'contextRoot': cmpPaths[i], output });
      }

      tracker.finish();
    })();
  }
};
module.exports = exports['default'];