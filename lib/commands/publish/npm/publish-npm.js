'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _execa = require('execa');

var _execa2 = _interopRequireDefault(_execa);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _logger = require('../../../helpers/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = o => {
  let { packages } = o;

  _logger2.default.enableProgress();

  const tracker = _logger2.default.newItem(`npm publish`);
  tracker.addWork(packages.size);

  return _bluebird2.default.map(packages, (() => {
    var _ref = _asyncToGenerator(function* ([pckname, pkg]) {

      tracker.silly('publishing', pckname);
      tracker.completeWork(1);

      return (0, _execa2.default)('npm', ['publish', '--access=public', '--ignore-scripts', '--tag', 'latest'], {
        'cwd': pkg.location,
        'stdout': 'inherit'
      });
    });

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  })(),
  // execa 5 times once
  { 'concurrency': 5 });
};

module.exports = exports['default'];