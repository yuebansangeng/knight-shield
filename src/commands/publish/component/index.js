
import path from 'path'
import Generator from 'yeoman-generator'
import singlePub from './single-pub'
import fg from 'fast-glob'
import logger from '../../../helpers/logger'
import 'colors'

export default class extends Generator {
  async writing () {
    const { independent, rc, contextRoot, cinumber, jobname } = this.options

    logger.enableProgress()
    let tracker = null
    
    if (independent) {

      let components = [ contextRoot ]
      if (rc.components.length) {
        components = await fg(rc.components, { 'onlyDirectories': true }).then(cps => 
          cps.map(p => path.join(contextRoot, p))
        )  
      }

      tracker = logger.newItem('publishing', components.length)

      for (let i = 0; i < components.length; i++) {

        logger.silly('publishing', components[i])
        tracker.completeWork(1)

        let { code ,message } = await singlePub({ 'contextRoot': components[i], cinumber, jobname })

        if (code !== 200) {
          throw new Error(message)
        }
      }

    } else {

      tracker = logger.newItem('publishing', 1)

      logger.silly('publishing', contextRoot)
      tracker.completeWork(1)

      let { code ,message } = await singlePub({ contextRoot, cinumber, jobname })

      if (code !== 200) {
        throw new Error(message)
      }
    }

    tracker.finish()
  }
}
