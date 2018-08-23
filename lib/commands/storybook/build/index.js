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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = class extends _yeomanGenerator2.default {

  writing() {
    var _this = this;

    return _asyncToGenerator(function* () {
      let { contextRoot, independent, rc, output = contextRoot, logger } = _this.options;

      // 用开发者自定义配置文件，覆盖默认文件
      (0, _overrideConfig2.default)({
        contextRoot,
        'storybookConfigPath': _path2.default.join(__dirname, '../../../', 'configs')
      });

      if (independent) {

        let components = yield _fastGlob2.default.sync(rc.components, { 'onlyDirectories': true });
        components = components.map(function (cmp) {
          return _path2.default.join(contextRoot, cmp);
        });

        logger.enableProgress();
        let tracker = logger.newItem('building', components.length);

        for (let i = 0; i < components.length; i++) {
          logger.silly('success', components[i]);
          tracker.completeWork(1);
          yield (0, _buildCmpStatics2.default)({ 'contextRoot': components[i], output });
        }

        tracker.finish();
      } else {

        yield (0, _buildCmpStatics2.default)({ contextRoot });
        logger.info('success', contextRoot);
      }
    })();
  }
};
module.exports = exports['default'];