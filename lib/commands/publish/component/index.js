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

require('colors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = class extends _yeomanGenerator2.default {
  writing() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const { independent, rc, contextRoot, cinumber, jobname } = _this.options;

      _logger2.default.enableProgress();
      let tracker = null;

      if (independent) {

        let components = yield _fastGlob2.default.sync(rc.components, { 'onlyDirectories': true });
        components = components.map(function (cmp) {
          return _path2.default.join(contextRoot, cmp);
        });

        tracker = _logger2.default.newItem('publishing', components.length);

        for (let i = 0; i < components.length; i++) {

          _logger2.default.silly('publishing', components[i]);
          tracker.completeWork(1);

          let { code, message } = yield (0, _singlePub2.default)({ 'contextRoot': components[i], cinumber, jobname });

          // 发布异常
          if (code !== 200) {
            throw new Error(message);
          }
        }
      } else {

        tracker = _logger2.default.newItem('publishing', 1);

        _logger2.default.silly('publishing', contextRoot);
        tracker.completeWork(1);

        let { code, message } = yield (0, _singlePub2.default)({ contextRoot, cinumber, jobname });

        // 发布异常
        if (code !== 200) {
          throw new Error(message);
        }
      }

      tracker.finish();
    })();
  }
};
module.exports = exports['default'];