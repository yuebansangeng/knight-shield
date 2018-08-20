
import path from 'path'
import request from 'request'
import { getContent } from './get-file-content'
import getExamples from '../../../helpers/make-stories/get-examples'
import check from './check'
import record from './record'
import readrc from '@beisen/read-rc'
import 'colors'

export default async (o) => {
  const { CMP_SERVER_HOST } = process.env
  const { contextRoot, cinumber, jobname } = o
  const packinfo = require(path.join(contextRoot, 'package.json'))
  const rc = readrc(contextRoot)

  // 记录组件构建
  await record({ 'package': packinfo, rc, cinumber, jobname })

  // 验证组件的配置
  await check({ 'package': packinfo, rc })

  // 获取组件目录中定义的示例
  const examples = getExamples(contextRoot)

  // 组装接口上传需要的文件
  let formData = {
    'name': packinfo.name,
    'version': packinfo.version,
    'rc': JSON.stringify(rc),
    'package': JSON.stringify(packinfo),
    'examples': JSON.stringify(examples),
    'readme': getContent(path.join(contextRoot, 'README.md'))
  }

  // 开发者没有自定义examples
  if (!examples.length) {
    formData['example_code_default'] = getContent(`${__dirname}/default-example.ejs`)
    formData['example_css_default'] = ''
    formData.examples = JSON.stringify([{ 'name': 'default' }])
  } else {
    // 提取组件示例的 js 和 css
    examples.forEach(({ name }) => {
      formData[`example_code_${name}`] = getContent(path.join(contextRoot, 'examples', name, 'index.js'))
      formData[`example_css_${name}`] = getContent(path.join(contextRoot, 'examples', name, 'index.css'))
    })
  }

  // 开始发布组件到共享中心
  console.log(`${'Starting'.yellow} publishing`)

  return new Promise((resolve, reject) => {
    request.post({
      'url': `${CMP_SERVER_HOST}/users/publish`,
      'form': formData
    },
      (err, resp, body) => {
        resolve({ err, resp, body })
      })
  })
}