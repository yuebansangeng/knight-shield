'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fastGlob = require('fast-glob');

var _fastGlob2 = _interopRequireDefault(_fastGlob);

var _child_process = require('child_process');

var _yeomanGenerator = require('yeoman-generator');

var _yeomanGenerator2 = _interopRequireDefault(_yeomanGenerator);

var _makeSingleLib = require('./make-single-lib');

var _makeSingleLib2 = _interopRequireDefault(_makeSingleLib);

var _logger = require('../../../helpers/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = class extends _yeomanGenerator2.default {

  writing() {
    var _this = this;

    return _asyncToGenerator(function* () {
      let { contextRoot, watch, rc, resp = null } = _this.options;
      let { components = [], workspaces = components } = rc;

      _logger2.default.enableProgress();
      let tracker = null;

      if (workspaces.length) {

        let packages = _fastGlob2.default.sync(workspaces, { 'onlyDirectories': true });
        packages = packages.map(function (p) {
          return _path2.default.join(contextRoot, p);
        });

        tracker = _logger2.default.newItem('building', packages.length);

        for (let i = 0; i < packages.length; i++) {

          _logger2.default.silly('success', packages[i]);
          tracker.completeWork(1);
          yield (0, _makeSingleLib2.default)({ 'contextRoot': packages[i] });
        }
      } else {

        tracker = _logger2.default.newItem('building', 1);

        _logger2.default.silly('success', contextRoot);
        tracker.completeWork(1);

        yield (0, _makeSingleLib2.default)({ contextRoot });
      }

      tracker.finish();
      _logger2.default.disableProgress();

      // 监听更新
      if (watch) {
        _logger2.default.info('watching', '*/src');
        (0, _child_process.fork)(`${__dirname}/watcher.js`, ['--workspaces', JSON.stringify(workspaces), '--context-root', contextRoot]);
      }
    })();
  }
};
module.exports = exports['default'];