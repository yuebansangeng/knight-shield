
import path from 'path'
import { spawn } from 'child_process'
import makeStories from '../../../helpers/make-stories'
import generateHttpHAREntry from '../../../helpers/generate-http-har-entry'
import readrc from '@beisen/read-rc'
import fg from 'fast-glob'
import execa from 'execa'

// 统一添加前缀组件模块前缀
export default async (o) => {
  const { contextRoot, output } = o
  const { 'name': module, version } = require(`${contextRoot}/package.json`)
  const storybookConfigPath = path.join(__dirname, '../../../', 'configs')

  // 获取rc配置文件中的配置
  let rc = readrc(contextRoot)

  // 组件名称
  const cname = rc.name || module

  // 生成 stories.js 配置文件
  let components = [contextRoot]
  if (rc.components) {
    components = await fg.sync(rc.components, { 'onlyDirectories': true })
    components = components.map(p => path.join(contextRoot, p))
  }
  makeStories({ storybookConfigPath, components })

  // 生成 https HAR 配置文件
  generateHttpHAREntry({
    // 该构建任务是jenkins调用，无法在执行指令时配置参数，只能在rc文件中获取
    'httpHARPath': rc.mock.https,
    contextRoot
  })

  return await execa('node',
    [
      'node_modules/.bin/build-storybook',
      '-c', storybookConfigPath,
      '-o', `${output || contextRoot}/storybook-static/${cname}/${version}`
    ],
    { }
  )
}
