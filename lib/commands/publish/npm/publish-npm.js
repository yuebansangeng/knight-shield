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

exports.default = o => {

  return _bluebird2.default.map(o.packages, ({ name, location }) => {

    _logger2.default.info('publishing', name);

    // '--ignore-scripts',
    return (0, _execa2.default)('npm', ['publish', '--access=public', '--tag', 'latest'], {
      'cwd': location,
      'stdout': 'inherit',
      'encoding': 'utf8'
    })
    // output err, but do not stop process
    .catch(({ stderr }) => console.log(stderr));
  },
  // execa 5 times once
  { 'concurrency': 3 });
};

module.exports = exports['default'];