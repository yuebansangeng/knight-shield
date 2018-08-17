
import path from 'path'
import fs, { readdirSync, lstatSync } from 'fs'
import ejs from 'ejs'
import Hjson from 'hjson'
import getExamples from '@beisen/get-examples'
import readrc from '@beisen/read-rc'

export default (options = {}) => {

  // 该函数需要同步执
  return new Promise((resolve, reject) => {
    const {
      cpath = process.cwd(),
      // 默认配置，提供给完毕使用二进制的方式调试命令使用
      storybookConfigPath = path.join(__dirname, '.storybook'),
      stoiresEjsTemplatePath = path.join(__dirname, 'stories.ejs'),
      targetStoireJsPath = path.join(storybookConfigPath, 'stories.js')
    } = options

    // 获取package中的配置项
    const packinfo = require(`${cpath}/package.json`)

    // 判断是否有 README 文件
    let hasReadme = false
    if (fs.existsSync(`${cpath}/README.md`)) {
      hasReadme = true
    }

    ejs.renderFile(
      stoiresEjsTemplatePath,
      {
        'examples': getExamples(cpath),
        'name': readrc(cpath).name || packinfo.name, // 默认名称，不依赖rc文件
        'cpath': cpath,
        'hasReadme': hasReadme
      },
      { }, // ejs options
      (err, storiesjs) => {
        if (err) throw err
        // 在组建项目中创建配置文件
        fs.writeFile(targetStoireJsPath, storiesjs, (err) => {
          if (err) {
            console.log(err)
            return reject(err)
          }
          resolve(storiesjs)
        })
      }
    )
  })
}
