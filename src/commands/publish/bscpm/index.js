
import Promise from 'bluebird'
import Generator from 'yeoman-generator'
import singlePub from './single-pub'
import logger from '../../../helpers/logger'
import collectUpdates from '../../../core/collect-updates'
import ReadRC from '../../../core/read-rc'
import PackageGraph from '../../../core/package-graph'

export default class extends Generator {
  async writing () {
    const { independent, contextRoot, onlyUpdated, username, 'package': packinfo } = this.options
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

    // publish metadata
    await Promise.map(
      cmpPaths,
      cp => {

        logger.silly('publishing', cp)
        tracker.completeWork(1)

        return singlePub({ 'contextRoot': cp, username })
      },
      { 'concurrency': 6 }
    ).then(() => {

      tracker.finish()
    })
    .catch(err => console.log(err))
  }
}
