'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _yeomanGenerator = require('yeoman-generator');

var _yeomanGenerator2 = _interopRequireDefault(_yeomanGenerator);

var _singlePub = require('./single-pub');

var _singlePub2 = _interopRequireDefault(_singlePub);

var _fastGlob = require('fast-glob');

var _fastGlob2 = _interopRequireDefault(_fastGlob);

var _logger = require('../../../helpers/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = class extends _yeomanGenerator2.default {
  writing() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const { independent, rc, contextRoot } = _this.options;

      _logger2.default.enableProgress();
      let tracker = null;

      let cmpPaths = [contextRoot];

      // 如果是 independent 模式，则使用 rc 文件中配置的 components
      if (independent) {
        if (rc.components.length) {
          cmpPaths = yield (0, _fastGlob2.default)(rc.components, { 'onlyDirectories': true }).then(function (cps) {
            return cps.map(function (p) {
              return _path2.default.join(contextRoot, p);
            });
          });
        }
      }

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