'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _execa = require('execa');

var _execa2 = _interopRequireDefault(_execa);

var _logger = require('../../../helpers/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (fileGlob, opts) => {
  _logger2.default.silly('gitCheckout', '.');
  return (0, _execa2.default)('git', ['checkout', '.'], opts);
};

module.exports = exports['default'];