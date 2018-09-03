
import path from 'path'
import Generator from 'yeoman-generator'
import singlePub from './single-pub'
import fg from 'fast-glob'
import logger from '../../../helpers/logger'

export default class extends Generator {
  async writing () {
    const { independent, rc, contextRoot } = this.options

    logger.enableProgress()
    let tracker = null

    let cmpPaths = [ contextRoot ]
    
    // 如果是 independent 模式，则使用 rc 文件中配置的 components
    if (independent) {
      if (rc.components.length) {
        cmpPaths = await fg(rc.components, { 'onlyDirectories': true }).then(cps => 
          cps.map(p => path.join(contextRoot, p))
        )  
      }
    }

    tracker = logger.newItem('publishing', cmpPaths.length)

    for (let i = 0; i < cmpPaths.length; i++) {

      logger.silly('publishing', cmpPaths[i])
      tracker.completeWork(1)

      let { code ,message } = await singlePub({ 'contextRoot': cmpPaths[i] })

      if (code !== 200) {
        throw new Error(message)
      }
    }

    tracker.finish()
  }
}
