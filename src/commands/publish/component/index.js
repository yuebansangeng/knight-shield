
import path from 'path'
import Generator from 'yeoman-generator'
import singlePub from './single-pub'
import fg from 'fast-glob'
import logger from '../../../helpers/logger'
import prepareCmpPaths from '../../../helpers/prepare-cmp-paths'

export default class extends Generator {
  async writing () {
    const { independent, rc, contextRoot } = this.options

    logger.enableProgress()
    let tracker = null

    let cmpPaths = prepareCmpPaths({ contextRoot, independent, rc })

    // TODO: publish if modified use `git diff`

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
