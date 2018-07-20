
import path from 'path'
import fs, { readdirSync, lstatSync } from 'fs'
import ejs from 'ejs'
import Hjson from 'hjson'
import getExamples from '@beisen/get-examples'

const cpath = process.cwd()
const { RC_FILENAME } = process.env

export default (options = {}) => {

  // 该函数需要同步执
  return new Promise((resolve, reject) => {
    const {
      storybookFolderName = '.storybook',
      // 默认配置，提供给完毕使用二进制的方式调试命令使用
      storybookConfigPath = path.join(__dirname, storybookFolderName)
    } = options

    // 获取package中的配置项
    const packinfo = require(`${cpath}/package.json`)
    // 获取组件的名字
    let rc = {}
    if (fs.existsSync(`${cpath}/${RC_FILENAME}`)) {
      rc = Hjson.parse(fs.readFileSync(`${cpath}/${RC_FILENAME}`, 'utf-8'))
    }

    ejs.renderFile(
      path.join(storybookConfigPath, 'stories.ejs'),
      {
        'examples': getExamples(cpath),
        'name': rc.name || packinfo.name, // 默认名称，不依赖rc文件
        'cpath': cpath
      },
      { }, // ejs options
      (err, storiesjs) => {
        if (err) throw err
        // 在组建项目中创建配置文件
        fs.writeFile(path.join(storybookConfigPath, 'stories.js'), storiesjs, (err) => {
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
