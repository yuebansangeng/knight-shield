
import path from 'path'
import execa from 'execa'
import override from '../../../helpers/override-config/override'

export default async (o) => {
  const { contextRoot } = o
  const storybookConfigPath = path.join(__dirname, '..', '..', '..', 'configs')

  // 用开发者自定义配置文件，覆盖默认文件
  override({
    'configPath': contextRoot,
    'destinationPath': storybookConfigPath,
    'configs': [
      'gulpfile.js',
      'tsconfig.json'
    ]
  })

  return await execa('node', [
      'node_modules/.bin/gulp',
      // 调整 gulpfile 配置文件的获取路径
      '--gulpfile', path.join(__dirname, '..', '..', '..', 'configs', 'gulpfile.js'),
      // 重定向 gulp 命令执行的路径到组件项目根目录
      '--cwd', contextRoot,
      '--colors'
    ],
    { 'encoding': 'utf8' }
  )
}
