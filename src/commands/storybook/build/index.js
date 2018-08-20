
import path from 'path'
import Generator from 'yeoman-generator'
import readrc from '@beisen/read-rc'
import fg from 'fast-glob'
import buildCmpStatics from './build-cmp-statics'

export default class extends Generator {

  async writing () {
    let { name } = this.options.rc
    let { 'name': module, version } = this.options.package
    let { contextRoot, independent, source } = this.options

    // 开发者可以自定义构建静路径
    let cpath = contextRoot
    if (source) {
      cpath = path.join(contextRoot, source)
    }
  
    let rc = readrc(cpath)
  
    let resp = null
  
    if (independent) {
  
      let components = await fg.sync(rc.components, { 'onlyDirectories': true })
      components = components.map(cmp => path.join(cpath, cmp))
  
      for (let i = 0; i < components.length; i++) {
        resp = await buildCmpStatics({
          'cpath': components[i],
          'staticOutputPath': cpath
        })
  
        if (resp.code !== 0) {
          throw new Error(resp.message)
        } else {
          console.log(resp.message)
        }
      }
  
    } else {
  
      resp = await buildCmpStatics({ cpath })
  
      if (resp.code !== 0) {
        throw new Error(resp.message)
      } else {
        console.log(resp.message)
      }
    }
  }
}
