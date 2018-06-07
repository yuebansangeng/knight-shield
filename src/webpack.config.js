
const path = require('path')
const babelrcJson = require('./babelrc.json')

module.exports = {
  'module': {
    'rules': [
      {
        'test': /\.js$/,
        'exclude': [
          /node_modules(?!\/@beisen\/storybook-lib)/
        ],
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
                  'browsers': ['last 1 version', 'ie >= 11'],
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
          'name': 'images/[name].[ext]'
        }
      },
      {
        'test': /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        'loader': 'url-loader',
        'options': {
          'limit': 10000,
          'name': path.join(__dirname, 'media/[name].[hash:7].[ext]')
        }
      },
      {
        'test': /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        'loader': 'url-loader',
        'options': {
          'limit': 10000,
          'name': path.join(__dirname, 'fonts/[name].[hash:7].[ext]')
        }
      }
    ],
  },
  'node': {
    'fs': 'empty'
  }
}
