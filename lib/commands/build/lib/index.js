'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _child_process = require('child_process');

var _yeomanGenerator = require('yeoman-generator');

var _yeomanGenerator2 = _interopRequireDefault(_yeomanGenerator);

var _makeSingleLib = require('./make-single-lib');

var _makeSingleLib2 = _interopRequireDefault(_makeSingleLib);

var _logger = require('../../../helpers/logger');

var _logger2 = _interopRequireDefault(_logger);

var _readRc = require('../../../helpers/read-rc');

var _readRc2 = _interopRequireDefault(_readRc);

var _configConsumer = require('../../../helpers/config-consumer');

var _configConsumer2 = _interopRequireDefault(_configConsumer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = class extends _yeomanGenerator2.default {
  writing() {
    let { contextRoot, watch, independent } = this.options;
    let rc = new _readRc2.default({ contextRoot });

    _logger2.default.enableProgress();
    let tracker = null;

    let buildPaths = [contextRoot];

    if (independent) {
      // component paths, default
      // override build paths
      buildPaths = rc.getLibsPath();
    }

    // generate configs
    new _configConsumer2.default({ contextRoot, 'name': rc.get('name') });

    tracker = _logger2.default.newItem('building', buildPaths.length);

    _bluebird2.default.map(buildPaths, subCmpContextRoot => {

      _logger2.default.silly('success', subCmpContextRoot);
      tracker.completeWork(1);

      return (0, _makeSingleLib2.default)({ 'contextRoot': subCmpContextRoot });
    },
    // 6 sub-process one time
    { 'concurrency': 6 }).then(() => {

      tracker.finish();
      _logger2.default.disableProgress();

      // watching change, rebuild
      if (watch) {
        _logger2.default.info('watching', '*/src');
        (0, _child_process.fork)(`${__dirname}/watcher.js`, ['--packages', JSON.stringify(buildPaths)]);
      }
    });
  }
};
module.exports = exports['default'];