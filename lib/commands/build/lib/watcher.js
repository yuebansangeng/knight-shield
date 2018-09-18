'use strict';

var _fastGlob = require('fast-glob');

var _fastGlob2 = _interopRequireDefault(_fastGlob);

var _chokidar = require('chokidar');

var _chokidar2 = _interopRequireDefault(_chokidar);

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _yeomanEnvironment = require('yeoman-environment');

var _yeomanEnvironment2 = _interopRequireDefault(_yeomanEnvironment);

var _logger = require('../../../helpers/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const argv = (0, _minimist2.default)(process.argv.slice(2));
const env = _yeomanEnvironment2.default.createEnv().register(require.resolve('../../build'), 'build');
const packages = JSON.parse(argv.packages);

packages.forEach(pack => {
  _chokidar2.default.watch(_path2.default.join(pack, 'src')).on('change', (event, path) => {
    env.run('build lib', { 'source': pack });
    _logger2.default.info('rebuild', pack);
  });
});