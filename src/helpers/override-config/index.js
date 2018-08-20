
import override from './override'

export default (o) => {
  let { contextRoot, storybookConfigPath } = o

  // 用开发者自定义配置文件，覆盖默认文件
  override({
    'configPath': `${contextRoot}/.storybook`,
    'destinationPath': storybookConfigPath,
    'configs': [
      'manager-head.html',
      'preview-head.html',
      'addons.js',
      'config.js',
      {
        'ori': 'webpack.config.js',
        'dest': 'webpack.extend.config.js'
      }
    ]
  })

  override({
    'configPath': contextRoot,
    'destinationPath': storybookConfigPath,
    'configs': [
      'tsconfig.json',
      {
        'ori': '.babelrc',
        'dest': 'babelrc.json' // 转换成json文件，不需要处理.babelrc路径
      }
    ]
  })
}