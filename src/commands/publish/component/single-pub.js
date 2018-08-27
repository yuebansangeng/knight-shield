
import path from 'path'
import request from 'request-promise'
import { getContent } from './get-file-content'
import getExamples from '../../../helpers/make-stories/get-examples'
import check from './check'
import record from './record'
import readrc from '../../../helpers/read-rc'
import 'colors'

export default async (o) => {
  const { CMP_SERVER_HOST } = process.env
  const { contextRoot, cinumber, jobname } = o
  const packinfo = require(path.join(contextRoot, 'package.json'))
  const rc = readrc(contextRoot)

  await record({ 'package': packinfo, rc, cinumber, jobname })
  await check({ 'package': packinfo, rc })

  const examples = getExamples(contextRoot)

  let formData = {
    'name': rc.name,
    'version': packinfo.version,
    'rc': JSON.stringify(rc),
    'package': JSON.stringify(packinfo),
    'examples': JSON.stringify(examples),
    'readme': getContent(path.join(contextRoot, 'README.md'))
  }

  if (!examples.length) {
    formData['example_code_default'] = getContent(`${__dirname}/default-example.ejs`)
    formData['example_css_default'] = ''
    formData.examples = JSON.stringify([{ 'name': 'default' }])
  } else {
    examples.forEach(({ name }) => {
      formData[`example_code_${name}`] = getContent(path.join(contextRoot, 'examples', name, 'index.js'))
      formData[`example_css_${name}`] = getContent(path.join(contextRoot, 'examples', name, 'index.css'))
    })
  }

  return await request.post({
    'url': `${CMP_SERVER_HOST}/users/publish`,
    'form': formData
  })
  .then(res => JSON.parse(res))
  .catch(err => { throw new Error(err) })
}
