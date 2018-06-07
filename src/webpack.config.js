
const path = require('path')
const deepmerge = require('deepmerge')
const babelrcJson = require('./babelrc.json')
const webpackExtendConfig = require('./webpack.extend.config')

module.exports = function (storybookBaseConfig, configType) {
  storybookBaseConfig.node = { fs: 'empty' }
  storybookBaseConfig.module.rules = storybookBaseConfig.module.rules.concat([
    {
      'test': /\.js$/,
      'use': [
        { 'loader': 'babel-loader', 'options': babelrcJson }
      ]
    },
    {
      'test': /\.scss|\.css$/,
      'use': [
        { 'loader': 'style-loader' },
        {
          'loader': 'css-loader',
          'options': { 'importLoaders': 2 },
        },
        {
          'loader': 'postcss-loader',
          'options': {
            plugins: () => [
              require('autoprefixer')({
                'browsers': [ 'last 1 version', 'ie >= 11' ],
              }),
            ],
          },
        },
        {
          'loader': 'sass-loader',
          'options': {
            'includePaths': [ path.resolve(__dirname, '..', 'node_modules') ],
          },
        },
      ],
    },
    {
      'test': /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      'loader': 'url-loader',
      'options': {
        'limit': 10000,
        'name': 'images/[name].[ext]',
        'publicPath': '../'
      }
    },
    {
      'test': /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      'loader': 'url-loader',
      'options': {
        'limit': 10000,
        'name': 'media/[name].[hash:7].[ext]'
      }
    },
    {
      'test': /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      'loader': 'url-loader',
      'options': {
        'limit': 10000,
        'name': 'fonts/[name].[hash:7].[ext]'
      }
    }
  ])
  // 用于配置外部可重写
  deepmerge(storybookBaseConfig, webpackExtendConfig)
}
