
import path from 'path'
import Generator from 'yeoman-generator'
import singlePub from './single-pub'
import fg from 'fast-glob'
import 'colors'

export default class extends Generator {
  async writing () {
    const { independent, rc, contextRoot, cinumber, jobname } = this.options

    let resp = null

    if (independent) {

      let components = await fg.sync(rc.components, { 'onlyDirectories': true })
      components = components.map(cmp => path.join(contextRoot, cmp))

      for (let i = 0; i < components.length; i++) {
        resp = await singlePub({ 'contextRoot': components[i], cinumber, jobname })
        this._private_response(resp)
      }
    } else {

      resp = await singlePub({ contextRoot, cinumber, jobname })

      this._private_response(resp)
    }
  }

  _private_response (res) {
    let { err, resp, body } = res

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
  }
}
