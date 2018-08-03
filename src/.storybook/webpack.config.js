
import path from 'path'
import babelrcJson from './babelrc.json'
import webpackExtendConfig from './webpack.extend.config'
// import WebpackMonitor from 'webpack-monitor'
// import minimist from 'minimist'

// const argv = minimist(process.argv.slice(2))

export default (storybookBaseConfig, configType) => {
  storybookBaseConfig.node = { 'fs': 'empty' }

  // 添加模块查找的默认后缀名
  storybookBaseConfig.resolve.extensions = storybookBaseConfig.resolve.extensions.concat([ '.ts', '.tsx' ])

  // Italent 提供的工具模块中，webpack添加了alias
  storybookBaseConfig.resolve.alias = {
    '&': path.join(process.cwd(), 'src')
  }

  // 组件依赖分析
  // argv.monitor && storybookBaseConfig.plugins.push(
  //   new WebpackMonitor({
  //     capture: true, // -> default 'true'
  //     target: `${process.cwd()}/monitor/stats.json`, // default -> '../monitor/stats.json'
  //     launch: true, // -> default 'false'
  //     port: 9004, // default -> 8081
  //     excludeSourceMaps: true // default 'true'
  //   })
  // )

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
