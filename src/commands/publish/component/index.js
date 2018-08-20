
import Generator from 'yeoman-generator'
import request from 'request'
import { getContent } from './get-file-content'
import getExamples from '../../../helpers/make-stories/get-examples'
import check from './check'
import record from './record'
import 'colors'

export default class extends Generator {
  async writing () {

    const { contextRoot, 'package': packinfo, rc, cinumber, jobname } = this.options
    const { CMP_SERVER_HOST } = process.env

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
      'package': getContent(`${contextRoot}/package.json`),
      'examples': JSON.stringify(examples),
      'readme': getContent(`${contextRoot}/README.md`)
    }

    // 提取组件示例的 js 和 css
    examples.forEach(({ name }) => {
      formData[`example_code_${name}`] = getContent(`${contextRoot}/examples/${name}/index.js`)
      formData[`example_css_${name}`] = getContent(`${contextRoot}/examples/${name}/index.css`)
    })

    // 开始发布组件到共享中心
    console.log(`${'Starting'.yellow} publishing`)

    request.post({
      'url': `${CMP_SERVER_HOST}/users/publish`,
      'form': formData
    },
    (err, resp, body) => {
      if (err || !/^2/.test(resp.statusCode)) {
        console.log(`${'Error'.red} publishing`)
        console.log(body)
        throw new Error(err)
      }

      // 处理结果返回值
      let { code, message } = JSON.parse(body)

      if (code === 200) {
        console.log(`${'Finished'.green} publishing`)
      } else {
        console.log(`${'Error'.red} publishing`)
        throw new Error(message)
      }
    })
  }
}
