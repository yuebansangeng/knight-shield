
import fs from 'fs'
import path from 'path'
import request from 'request-promise'
import getExamples from '../../../helpers/make-stories/get-examples'
import check from './check'
import readrc from '../../../helpers/read-rc'
import { spawnSync } from 'child_process'

let getContentIfExists = (cp) => {
  return fs.existsSync(cp) ? fs.readFileSync(cp, 'utf8') : ''
}

export default async (o) => {
  const { CMP_SERVER_HOST } = process.env
  const { contextRoot } = o
  const packinfo = require(path.join(contextRoot, 'package.json'))
  const rc = readrc(contextRoot)

  await check({ 'package': packinfo, rc })

  // 修改rc文件, 添加 developers
  const { stdout } = spawnSync('git', [ 'config', 'user.name' ])
  let username = `${stdout}`.replace(/^\s+|\s+$/, '')
  rc.developers = [username]

  const examples = getExamples(contextRoot)

  let formData = {
    'name': rc.name,
    'rc': JSON.stringify(rc),
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

  return await request.post({
    'url': `${CMP_SERVER_HOST}/users/publish`,
    'form': formData
  })
  .then(res => JSON.parse(res))
  .catch(err => { throw new Error(err) })
}
