'use strict';

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var path = require('path');
var babelrcJson = require('./babelrc.json');
var webpackExtendConfig = require('./webpack.extend.config');

module.exports = function (storybookBaseConfig, configType) {
  storybookBaseConfig.node = { fs: 'empty' };
  storybookBaseConfig.module.rules = storybookBaseConfig.module.rules.concat([{
    'test': /\.js$/,
    'exclude': /node_modules/,
    'use': [{ 'loader': 'babel-loader', 'options': babelrcJson }]
  }, {
    'test': /\.tsx?$/,
    'loader': 'ts-loader'
  }, {
    'test': /\.scss|\.css$/,
    'use': [{ 'loader': 'style-loader' }, {
      'loader': 'css-loader',
      'options': { 'importLoaders': 2 }
    }, {
      'loader': 'postcss-loader',
      'options': {
        plugins: function plugins() {
          return [require('autoprefixer')({
            'browsers': ['last 1 version', 'ie >= 11']
          })];
        }
      }
    }, {
      'loader': 'sass-loader',
      'options': {
        'includePaths': [path.resolve(__dirname, '..', 'node_modules')]
      }
    }]
  }, {
    'test': /\.(png|jpe?g|gif|svg)(\?.*)?$/,
    'loader': 'url-loader',
    'options': {
      'limit': 10000,
      'name': 'images/[name].[ext]',
      'publicPath': '../'
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

  // 如果外部传入了outpu，merge
  if (webpackExtendConfig.output) {
    (0, _extends3.default)(storybookBaseConfig.output, webpackExtendConfig.output);
  }
  // 默认没有externals（underfined)，外部传入则赋值
  if (webpackExtendConfig.externals) {
    storybookBaseConfig.externals = webpackExtendConfig.externals;
  }

  return storybookBaseConfig;
};