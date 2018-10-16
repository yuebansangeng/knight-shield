'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _babelrc = require('./babelrc.json');

var _babelrc2 = _interopRequireDefault(_babelrc);

var _webpackExtend = require('./webpack.extend.config');

var _webpackExtend2 = _interopRequireDefault(_webpackExtend);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (storybookBaseConfig, configType) => {
  storybookBaseConfig.node = { 'fs': 'empty' };

  storybookBaseConfig.resolve.extensions = storybookBaseConfig.resolve.extensions.concat(['.ts', '.tsx']);

  storybookBaseConfig.resolve.alias = {
    '&': _path2.default.join(process.cwd(), 'src')
  };

  storybookBaseConfig.module.rules = storybookBaseConfig.module.rules.concat([{
    'test': /\.js$/,
    'exclude': /node_modules/,
    'use': [{ 'loader': 'babel-loader', 'options': _babelrc2.default }]
  }, {
    'test': /\.tsx?$/,
    'loader': 'ts-loader',
    'options': {
      // use 'configFile' must use 'context'
      'context': process.cwd(),
      'configFile': _path2.default.join(__dirname, 'tsconfig.json')
    }
  }, {
    'test': /\.scss|\.css$/,
    'use': [{ 'loader': 'style-loader' }, {
      'loader': 'css-loader',
      'options': { 'importLoaders': 2 }
    }, {
      'loader': 'postcss-loader',
      'options': {
        plugins: () => [require('autoprefixer')({
          'browsers': ['last 1 version', 'ie >= 11']
        })]
      }
    }, {
      'loader': 'sass-loader',
      'options': {
        'includePaths': [_path2.default.resolve(__dirname, '..', 'node_modules')]
      }
    }]
  }, {
    'test': /\.less$/,
    'use': [{ 'loader': 'style-loader' }, {
      'loader': 'css-loader',
      'options': { 'importLoaders': 2 }
    }, {
      'loader': 'postcss-loader',
      'options': {
        plugins: () => [require('autoprefixer')({
          'browsers': ['last 1 version', 'ie >= 11']
        })]
      }
    }, {
      'loader': 'less-loader'
    }]
  }, {
    'test': /\.(png|jpe?g|gif|svg)(\?.*)?$/,
    'loader': 'url-loader',
    'options': {
      'limit': 10000,
      'name': 'images/[name].[ext]'
    }
  }, {
    'test': /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
    'loader': 'url-loader',
    'options': {
      'limit': 10000,
      'name': 'media/[name].[hash:7].[ext]'
    }
  }, {
    'test': /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
    'loader': 'url-loader',
    'options': {
      'limit': 10000,
      'name': 'fonts/[name].[hash:7].[ext]'
    }
  }]);

  // custom webpack.config.js override
  storybookBaseConfig = (0, _webpackExtend2.default)(storybookBaseConfig, configType);

  return storybookBaseConfig;
};

module.exports = exports.default;