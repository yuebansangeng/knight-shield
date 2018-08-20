'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _override = require('./override');

var _override2 = _interopRequireDefault(_override);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = o => {
  let { contextRoot, storybookConfigPath } = o;

  // 用开发者自定义配置文件，覆盖默认文件
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
      'dest': 'babelrc.json' // 转换成json文件，不需要处理.babelrc路径
    }]
  });
};

module.exports = exports['default'];