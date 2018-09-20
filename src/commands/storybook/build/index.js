
import path from 'path'
import Promise from 'bluebird'
import Generator from 'yeoman-generator'
import buildCmpStatics from './build-cmp-statics'
import collectUpdates from '../../../core/collect-updates'
import logger from '../../../helpers/logger'
import ReadRC from '../../../core/read-rc'
import PackageGraph from '../../../core/package-graph'

export default class extends Generator {

  async writing () {
    const { contextRoot, independent, onlyUpdated, 'package': packinfo } = this.options
    const rc = new ReadRC({ contextRoot })

    logger.enableProgress()
    let tracker = null

    // independent
    let cmpPaths = independent ? rc.getComponentsPath() : [ contextRoot ]

    // onlyUpdated
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

    tracker = logger.newItem('building', cmpPaths.length)

    // build statics 3
    await Promise.map(
      cmpPaths,
      cp => {

        logger.silly('building', cp)
        tracker.completeWork(1)

        return buildCmpStatics({ 'contextRoot': cp, 'output': contextRoot })
      },
      // must 1, because config/stories.js
      { 'concurrency': 3 }
    ).then(() => {

      tracker.finish()
    })
  }
}
