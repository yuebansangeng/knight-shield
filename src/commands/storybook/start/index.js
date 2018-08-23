
import path from 'path'
import Generator from 'yeoman-generator'
import { spawn } from 'child_process'
import makeStories from '../../../helpers/make-stories'
import overrideConfig from '../../../helpers/override-config'
import generateHttpHAREntry from '../../../helpers/generate-http-har-entry'
import fg from 'fast-glob'
import execa from 'execa'

export default class extends Generator {

  async writing () {
    let { contextRoot, rc, port = '9001' } = this.options
    const storybookConfigPath = path.join(__dirname, '../../../', 'configs')

    // 用开发者自定义配置文件，覆盖默认文件
    overrideConfig({ contextRoot, storybookConfigPath })

    // 获取需要展示示例的组件路径
    // 配置 运行环境 需要的 stories 配置问题
    let components = [ contextRoot ]
    if (rc.components.length) {
      components = await fg(rc.components, { 'onlyDirectories': true }).then(cps => 
        cps.map(p => path.join(contextRoot, p))
      )
    }
    makeStories({ storybookConfigPath, components })

    // 生成 https HAR 配置文件
    // 同时支持 "参数" 和 "配置" 方式
    generateHttpHAREntry({ 'httpHARPath': rc.mock.https, contextRoot })

    // 启动本地调试环境
    execa('node',
      [
        'node_modules/.bin/start-storybook',
        '-s', '.',
        '-p', port,
        '-c', storybookConfigPath
      ],
      { 'stdio': 'inherit' }
    )
  }
}
