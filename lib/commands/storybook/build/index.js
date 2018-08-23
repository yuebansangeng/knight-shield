'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fastGlob = require('fast-glob');

var _fastGlob2 = _interopRequireDefault(_fastGlob);

var _yeomanGenerator = require('yeoman-generator');

var _yeomanGenerator2 = _interopRequireDefault(_yeomanGenerator);

var _buildCmpStatics = require('./build-cmp-statics');

var _buildCmpStatics2 = _interopRequireDefault(_buildCmpStatics);

var _overrideConfig = require('../../../helpers/override-config');

var _overrideConfig2 = _interopRequireDefault(_overrideConfig);

var _logger = require('../../../helpers/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = class extends _yeomanGenerator2.default {

  writing() {
    var _this = this;

    return _asyncToGenerator(function* () {
      let { contextRoot, independent, rc, output = contextRoot } = _this.options;

      // 用开发者自定义配置文件，覆盖默认文件
      (0, _overrideConfig2.default)({
        contextRoot,
        'storybookConfigPath': _path2.default.join(__dirname, '../../../', 'configs')
      });

      _logger2.default.enableProgress();
      let tracker = null;

      // 获取相关组件集合的配置
      let components = [contextRoot];
      if (rc.components.length) {
        components = yield (0, _fastGlob2.default)(rc.components, { 'onlyDirectories': true }).then(function (cps) {
          return cps.map(function (p) {
            return _path2.default.join(contextRoot, p);
          });
        });
      }

      // 在组件集合中的所有的组件，都单独进行构建
      if (independent) {

        tracker = _logger2.default.newItem('building', components.length);

        for (let i = 0; i < components.length; i++) {
          _logger2.default.silly('building', components[i]);
          tracker.completeWork(1);
          yield (0, _buildCmpStatics2.default)({ 'contextRoot': components[i], output });
        }
      } else {

        tracker = _logger2.default.newItem('building', 1);

        _logger2.default.silly('building', contextRoot);
        tracker.completeWork(1);

        yield (0, _buildCmpStatics2.default)({ contextRoot, components });
      }

      tracker.finish();
    })();
  }
};
module.exports = exports['default'];