'use strict';

var path = require('path');
var deepmerge = require('deepmerge');
var babelrcJson = require('./babelrc.json');
var webpackExtendConfig = require('./webpack.extend.config');

module.exports = function (storybookBaseConfig, configType) {
  storybookBaseConfig.node = { fs: 'empty' };
  storybookBaseConfig.module.rules = storybookBaseConfig.module.rules.concat([{
    'test': /\.js$/,
    'exclude': /node_modules/,
    'use': [{ 'loader': 'babel-loader', 'options': babelrcJson }]
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

  // 用于配置外部可重写
  // 允许外部修改 output 和 externals
  deepmerge(storybookBaseConfig, webpackExtendConfig);

  return storybookBaseConfig;
};