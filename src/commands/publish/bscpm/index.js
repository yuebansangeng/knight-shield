
import Generator from 'yeoman-generator'
import singlePub from './single-pub'
import logger from '../../../helpers/logger'
import collectUpdates from '../../../core/collect-updates'
import ReadRC from '../../../core/read-rc'
import PackageGraph from '../../../core/package-graph'

export default class extends Generator {
  async writing () {
    const { independent, contextRoot, onlyUpdated, 'package': packinfo } = this.options
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

    // update moudules version first
    // after exec build statics
    new PackageGraph({
      contextRoot,
      'paths': independent ? rc.getLocalModulesPath() : [ contextRoot ]
    }).updatePackages(null, packinfo.version)

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
