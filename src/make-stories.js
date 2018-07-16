
import path from 'path'
import fs from 'fs'
import ejs from 'ejs'
import getdemos from './get-demos'
import Hjson from 'hjson'

const cpath = process.cwd()

export default (options) => {
  return new Promise((resolve, reject) => {

    const storybookFolderName = '.storybook'
    const {
      // 默认配置，提供给完毕使用二进制的方式调试命令使用
      storybookConfigPath = path.join(__dirname, storybookFolderName)
    } = options

    // 获取组件的名字
    const bscpmrc = Hjson.parse(fs.readFileSync(path.join(cpath, '.bscpmrc.json'), 'utf-8'))

    ejs.renderFile(
      path.join(storybookConfigPath, 'stories.ejs'),
      {
        'examples': getdemos(path.join(cpath, 'examples')),
        'name': bscpmrc.name,
        'cpath': cpath
      },
      { }, // ejs options
      (err, storiesjs) => {
        if (err) throw err
        // 在组建项目中创建配置文件
        fs.writeFile(path.join(storybookConfigPath, storybookFolderName, 'stories.js'), storiesjs, (err) => {
          if (err) {
            console.log(err)
            return reject(false)
          }
          resolve(true)
        })
      }
    )
  })
}
