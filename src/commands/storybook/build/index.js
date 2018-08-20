
import path from 'path'
import Generator from 'yeoman-generator'
import fg from 'fast-glob'
import buildCmpStatics from './build-cmp-statics'

export default class extends Generator {

  async writing () {
    let { contextRoot, independent, rc, output, resp = null } = this.options
  
    if (independent) {
  
      let components = await fg.sync(rc.components, { 'onlyDirectories': true })
      components = components.map(cmp => path.join(contextRoot, cmp))
  
      for (let i = 0; i < components.length; i++) {
        resp = await buildCmpStatics({
          'contextRoot': components[i],
          'output': output || contextRoot
        })
  
        if (resp.code !== 0) {
          throw new Error(resp.message)
        } else {
          console.log(resp.message)
        }
      }
  
    } else {
  
      resp = await buildCmpStatics({ contextRoot })
  
      if (resp.code !== 0) {
        throw new Error(resp.message)
      } else {
        console.log(resp.message)
      }
    }
  }
}
