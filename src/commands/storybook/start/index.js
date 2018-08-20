
import path from 'path'
import Generator from 'yeoman-generator'
import { spawn } from 'child_process'
import colorlog from './color-log'
import makeStories from '../../../helpers/make-stories'
import overrideConfig from '../../../helpers/override-config'
import generateHttpHAREntry from '../../../helpers/generate-http-har-entry'
import fg from 'fast-glob'

export default class extends Generator {

  async writing () {
    let { contextRoot, rc, port = '9001' } = this.options
    const storybookConfigPath = path.join(__dirname, '../../../', 'configs')

    // 用开发者自定义配置文件，覆盖默认文件
    overrideConfig({
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

    overrideConfig({
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

    // 获取需要展示示例的组件路径
    // 配置 运行环境 需要的 stories 配置问题
    let components = [ contextRoot ]
    if (rc.components) {
      components = await fg.sync(rc.components, { 'onlyDirectories': true })
      components = components.map(p => path.join(contextRoot, p))
    }
    makeStories({ storybookConfigPath, components })

    // 生成 https HAR 配置文件
    // 同时支持 "参数" 和 "配置" 方式
    generateHttpHAREntry({
      'httpHARPath': rc.mock.https,
      contextRoot
    })

    // 启动本地调试环境
    let cp_sytb = spawn('node',
      [
        'node_modules/.bin/start-storybook',
        '-s', '.',
        '-p', port,
        '-c', storybookConfigPath
      ],
      { }
    )
    cp_sytb.stdout.on('data', data => colorlog(data))
    cp_sytb.stderr.on('data', err_data => colorlog(err_data))
  }
}
