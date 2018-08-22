
import path from 'path'
import babelrcJson from './babelrc.json'
import webpackExtendConfig from './webpack.extend.config'

export default (storybookBaseConfig, configType) => {
  storybookBaseConfig.node = { 'fs': 'empty' }

  // 添加模块查找的默认后缀名
  storybookBaseConfig.resolve.extensions = storybookBaseConfig.resolve.extensions.concat([ '.ts', '.tsx' ])

  // Italent 提供的工具模块中，webpack添加了alias
  storybookBaseConfig.resolve.alias = {
    '&': path.join(process.cwd(), 'src')
  }

  storybookBaseConfig.module.rules = storybookBaseConfig.module.rules.concat([
    {
      'test': /\.js$/,
      'exclude': /node_modules/,
      'use': [
        { 'loader': 'babel-loader', 'options': babelrcJson }
      ]
    },
    {
      'test': /\.tsx?$/,
      'loader': 'ts-loader',
      'options': {
        // context 属性，3.5.0 版本的 ts-loader 才支持（4版本的tsloader需要webbpack4以上）
        // tsLoader 自定义的configFile不再项目跟录中，则需要指定content为项目跟目录
        // https://github.com/TypeStrong/ts-loader/issues/732
        // process.cwd() -> **/[project folder]
        'context': process.cwd(),
        // 自定义获取tsconfig.json的路径
        'configFile': path.join(__dirname, 'tsconfig.json')
      }
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
        }
      ]
    },
    {
      'test': /\.less$/,
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
          'loader': 'less-loader'
        }
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

  // 外部可以重写配置
  storybookBaseConfig = webpackExtendConfig(storybookBaseConfig, configType)

  return storybookBaseConfig
}
