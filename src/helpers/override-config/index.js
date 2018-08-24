
import override from './override'

export default (o) => {
  let { contextRoot, storybookConfigPath } = o

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
        'dest': 'babelrc.json'
      }
    ]
  })
}