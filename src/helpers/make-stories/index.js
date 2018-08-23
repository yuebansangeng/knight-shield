
import path from 'path'
import fs from 'fs'
import ejs from 'ejs'
import getExamples from './get-examples'
import readrc from '../read-rc'

export default (options = {}) => {

  // 该函数需要同步执
  return new Promise((resolve, reject) => {
    
    const { storybookConfigPath, components = [] } = options

    const storyMetas = components.map(contentRoot => {

      // 获取package中的配置项
      const packinfo = require(`${contentRoot}/package.json`)
      const examples = getExamples(contentRoot)
      const rc = readrc(contentRoot)

      // 判断是否有 README 文件
      let readme = ''
      if (fs.existsSync(`${contentRoot}/README.md`)) {
        readme = `require('${contentRoot}/README.md')`
      }

      // 生成 storybook 需要的组件元数据
      let stories = []
      if (!examples.length) {
        stories.push({
          'name': 'default',
          'story': {
            'component': `require('${contentRoot}/src')`
          }
        })
      } else {
        stories = examples.map(exp => ({
          'name': exp.name,
          'story': {
            'component': `require('${contentRoot}/examples/${exp.name}')`
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
