
import path from 'path'
import { spawn } from 'child_process'
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

  // 生成 lib 目录，以及内部转义好的文件
  return await new Promise((resolve, reject) => {
    // 执行 gulp 命令
    let cp_n = spawn('node', [
      'node_modules/.bin/gulp',
      // 调整 gulpfile 配置文件的获取路径
      '--gulpfile', path.join(__dirname, '..', '..', '..', 'configs', 'gulpfile.js'),
      // 重定向 gulp 命令执行的路径到组件项目根目录
      '--cwd', contextRoot,
      '--colors'
    ], { 'encoding': 'utf8' })

    // 监听返回值，close时结束
    let message = []
    cp_n.stdout.on('data', data => message.push(`${data}`))
    cp_n.stderr.on('data', err_data => message.push(`${err_data}`))
    cp_n.stderr.on('close', code => {
      resolve({ code, 'message': message.join('') })
    })
  })
}
