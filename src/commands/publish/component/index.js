
import path from 'path'
import Generator from 'yeoman-generator'
import singlePub from './single-pub'
import fg from 'fast-glob'
import 'colors'
import logger from '../../../helpers/logger'

export default class extends Generator {
  async writing () {
    const { independent, rc, contextRoot, cinumber, jobname } = this.options

    logger.enableProgress()
    let tracker = null
    
    if (independent) {

      let components = await fg.sync(rc.components, { 'onlyDirectories': true })
      components = components.map(cmp => path.join(contextRoot, cmp))


      tracker = logger.newItem('publishing', components.length)

      for (let i = 0; i < components.length; i++) {

        logger.silly('publishing', components[i])
        tracker.completeWork(1)

        let { code ,message } = await singlePub({ 'contextRoot': components[i], cinumber, jobname })

        // 发布异常
        if (code !== 200) {
          throw new Error(message)
        }
      }

    } else {

      tracker = logger.newItem('publishing', 1)

      logger.silly('publishing', contextRoot)
      tracker.completeWork(1)

      let { code ,message } = await singlePub({ contextRoot, cinumber, jobname })

      // 发布异常
      if (code !== 200) {
        throw new Error(message)
      }
    }

    tracker.finish()
  }
}
