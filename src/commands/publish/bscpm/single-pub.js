
import fs from 'fs'
import path from 'path'
import execa from 'execa'
import check from './check'
import request from 'request-promise'
import { getExamples } from '../../../core/config-consumer'
import ReadRC from '../../../core/read-rc'

export default o => {
  const { CMP_SERVER_HOST } = process.env
  const { contextRoot, username } = o
  const packinfo = require(path.join(contextRoot, 'package.json'))
  const rc = new ReadRC({ contextRoot })
  const rcJson = rc.toJSON()

  // first check
  return check({
    'module': packinfo.name,
    'name': rcJson.name,
    'team': rcJson.team
  }).then(({ code, message, data }) => {

    if (code !== 200 || !data) throw new Error(message)

    // 修改rc文件, 添加 developers
    rcJson.developers = [ username ]

    const examples = getExamples(contextRoot)

    let formData = {
      'name': rcJson.name,
      'rc': JSON.stringify(rcJson),
      'version': packinfo.version,
      'package': JSON.stringify(packinfo),
      'examples': JSON.stringify(examples),
      'readme': getContentIfExists(path.join(contextRoot, 'README.md'))
    }

    if (!examples.length) {
      formData['example_code_default'] = getContentIfExists(`${__dirname}/example.ejs`)
      formData['example_css_default'] = ''
      formData.examples = JSON.stringify([{ 'name': 'default' }])
    } else {
      examples.forEach(({ name }) => {
        formData[`example_code_${name}`] = getContentIfExists(path.join(contextRoot, 'examples', name, 'index.js'))
        formData[`example_css_${name}`] = getContentIfExists(path.join(contextRoot, 'examples', name, 'index.css'))
      })
    }

    return request.post({
      'url': `${CMP_SERVER_HOST}/users/publish`,
      'form': formData
    })
    .then(res => JSON.parse(res))
    .catch(err => { console.log(err) })

  }).catch(err => { console.log(err) })
}

const getContentIfExists = (cp) => {
  return fs.existsSync(cp) ? fs.readFileSync(cp, 'utf8') : ''
}

