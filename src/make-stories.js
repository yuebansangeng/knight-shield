
import path, { readdirSync, lstatSync } from 'path'
import fs from 'fs'
import ejs from 'ejs'
import Hjson from 'hjson'

const cpath = process.cwd()

export default async (options = {}) => {

  // 该函数需要同步执
  return await new Promise((resolve, reject) => {
    const {
      storybookFolderName = '.storybook',
      // 默认配置，提供给完毕使用二进制的方式调试命令使用
      storybookConfigPath = path.join(__dirname, storybookFolderName)
    } = options

    // 获取组件的名字
    const bscpmrc = Hjson.parse(fs.readFileSync(path.join(cpath, '.bscpmrc.json'), 'utf-8'))

    // 获取组件目录中定义的示例
    const examples = readdirSync(path.join(cpath, 'examples'))
      .map(name => path.join(source, name))
      .filter(source => lstatSync(source).isDirectory())
      .map(name => {
        return { 'name': name.split('\/')[name.split('\/').length - 1] }
      })

    ejs.renderFile(
      path.join(storybookConfigPath, 'stories.ejs'),
      {
        'examples': examples,
        'name': bscpmrc.name,
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
