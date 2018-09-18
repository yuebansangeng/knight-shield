
import Generator from 'yeoman-generator'
import singlePub from './single-pub'
import logger from '../../../helpers/logger'
import collectUpdates from '../../../helpers/collect-updates'
import ReadRC from '../../../helpers/read-rc'

export default class extends Generator {
  async writing () {
    const { independent, contextRoot, onlyUpdated } = this.options
    const rc = new ReadRC({ contextRoot })

    logger.enableProgress()
    let tracker = null

    // independent
    let cmpPaths = independent ? rc.getComponentsPath() : [ contextRoot ]

    // only-updated
    if (onlyUpdated) {
      cmpPaths = await collectUpdates({
        contextRoot,
        // 'false': only need relative path, for git diff check
        'cmpPaths': independent ? rc.getComponentsPath(false) : [ '.' ]
      })
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
