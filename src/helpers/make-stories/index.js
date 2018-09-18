
import path from 'path'
import fs from 'fs'
import ejs from 'ejs'
import getExamples from './get-examples'
import ReadRC from '../read-rc'

export default (options = {}) => {

  return new Promise((resolve, reject) => {
    
    const { storybookConfigPath, cmpPaths = [] } = options

    const storyMetas = cmpPaths.map(contentRoot => {

      const packinfo = require(`${contentRoot}/package.json`)
      const examples = getExamples(contentRoot)
      const rc = new ReadRC({ contentRoot })

      let readme = ''
      if (fs.existsSync(`${contentRoot}/README.md`)) {
        readme = `require('${contentRoot}/README.md')`
      }

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
        'name': rc.get('name'),
        'stories': stories,
        'readme': readme
      }
    })

    ejs.renderFile(
      path.join(__dirname, 'stories.ejs'),
      { storyMetas },
      {},
      (err, storiesjs) => {
        if (err) throw err
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
