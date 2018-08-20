
import path from 'path'
import fs from 'fs'
import ejs from 'ejs'
import getExamples from './get-examples'
import readrc from '@beisen/read-rc'

export default (options = {}) => {

  // 该函数需要同步执
  return new Promise((resolve, reject) => {
    
    const { storybookConfigPath, components = [] } = options

    const storyMetas = components.map(cpath => {

      // 获取package中的配置项
      const packinfo = require(`${cpath}/package.json`)
      const examples = getExamples(cpath)
      const rc = readrc(cpath)

      // 判断是否有 README 文件
      let readme = ''
      if (fs.existsSync(`${cpath}/README.md`)) {
        readme = `require('${cpath}/README.md')`
      }

      // 生成 storybook 需要的组件元数据
      let stories = []
      if (!examples.length) {
        stories.push({
          'name': 'default',
          'story': {
            'component': `require('${cpath}/src')`
          }
        })
      } else {
        stories = examples.map(exp => ({
          'name': exp.name,
          'story': {
            'component': `require('${cpath}/examples/${exp.name}')`
          }
        }))
      }

      return {
        'name': rc.name || packinfo.name,
        'stories': stories,
        'readme': readme
      }
    })

    ejs.renderFile(
      path.join(__dirname, 'stories.ejs'),
      { storyMetas },
      {}, // ejs options
      (err, storiesjs) => {
        if (err) throw err
        // 在组建项目中创建配置文件
        fs.writeFile(path.join(storybookConfigPath, 'stories.js'), storiesjs, (err) => {
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
