
import fs from 'fs'
import path from 'path'
import request from 'request-promise'
import getExamples from '../../../helpers/make-stories/get-examples'
import check from './check'
import readrc from '../../../helpers/read-rc'
import 'colors'

export default async (o) => {
  const { CMP_SERVER_HOST } = process.env
  const { contextRoot } = o
  const packinfo = require(path.join(contextRoot, 'package.json'))
  const rc = readrc(contextRoot)

  await check({ 'package': packinfo, rc })

  const examples = getExamples(contextRoot)

  let formData = {
    'name': rc.name,
    'version': packinfo.version,
    'rc': JSON.stringify(rc),
    'package': JSON.stringify(packinfo),
    'examples': JSON.stringify(examples),
    'readme': fs.readFileSync(path.join(contextRoot, 'README.md'), 'utf8')
  }

  if (!examples.length) {
    formData['example_code_default'] = fs.readFileSync(`${__dirname}/example.ejs`, 'utf8')
    formData['example_css_default'] = ''
    formData.examples = JSON.stringify([{ 'name': 'default' }])
  } else {
    examples.forEach(({ name }) => {
      formData[`example_code_${name}`] = fs.readFileSync(path.join(contextRoot, 'examples', name, 'index.js'), 'utf8')
      formData[`example_css_${name}`] = fs.readFileSync(path.join(contextRoot, 'examples', name, 'index.css'), 'utf8')
    })
  }

  return await request.post({
    'url': `${CMP_SERVER_HOST}/users/publish`,
    'form': formData
  })
  .then(res => JSON.parse(res))
  .catch(err => { throw new Error(err) })
}
