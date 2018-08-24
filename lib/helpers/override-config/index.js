'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _override = require('./override');

var _override2 = _interopRequireDefault(_override);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = o => {
  let { contextRoot, storybookConfigPath } = o;

  (0, _override2.default)({
    'configPath': `${contextRoot}/.storybook`,
    'destinationPath': storybookConfigPath,
    'configs': ['manager-head.html', 'preview-head.html', 'addons.js', 'config.js', {
      'ori': 'webpack.config.js',
      'dest': 'webpack.extend.config.js'
    }]
  });

  (0, _override2.default)({
    'configPath': contextRoot,
    'destinationPath': storybookConfigPath,
    'configs': ['tsconfig.json', {
      'ori': '.babelrc',
      'dest': 'babelrc.json'
    }]
  });
};

module.exports = exports['default'];