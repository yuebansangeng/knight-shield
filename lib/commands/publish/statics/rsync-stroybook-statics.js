'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _execa = require('execa');

var _execa2 = _interopRequireDefault(_execa);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = o => {
  const { contextRoot } = o;
  const { STATIC_SERVER_S } = process.env;
  const servers = STATIC_SERVER_S.split(',');

  return _bluebird2.default.map(
  // servers: user@ip:/path,...
  servers, server => {

    // either independent nor !, only have one storybook-static folder in the contextRoot
    return (0, _execa2.default)('rsync', ['-av', `${contextRoot}/storybook-static/*`, server], {
      'cwd': contextRoot,
      'stdout': 'inherit',
      'encoding': 'utf8'
    }).catch(({ stderr }) =>
    // output err, but do not stop process
    console.log(stderr));
  },
  // execa 2 times once
  { 'concurrency': 2 });
};

module.exports = exports['default'];