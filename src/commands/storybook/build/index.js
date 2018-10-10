
import Promise from 'bluebird'
import Generator from 'yeoman-generator'
import buildCmpStatics from './build-cmp-statics'
import logger from '../../../helpers/logger'
import ReadRC from '../../../core/read-rc'
import PackageGraph from '../../../core/package-graph'
import Lifecycle from '../../../core/lifecycle'

export default class extends Generator {

  async writing () {
    const { contextRoot, independent, onlyUpdated, 'package': packinfo } = this.options
    const rc = new ReadRC({ contextRoot })
    const lifecycle = new Lifecycle({ contextRoot })
    // update moudules version first
    // after exec build statics
    const packageGraph = new PackageGraph({
      contextRoot,
      'paths': independent ? rc.getLocalModulesPath() : [ contextRoot ]
    })
    // build paths
    let cmpPaths = independent ? rc.getComponentsPath() : [ contextRoot ]


    packageGraph.updatePackages(null, packinfo.version)

    if (onlyUpdated) {
      // filter packages && get updates
      let filteredPackages = this._private_getCmpPackages()
      cmpPaths = packageGraph.collectUpdates(filteredPackages)
    }

    logger.enableProgress()
    let tracker = logger.newItem('building', cmpPaths.length)

    // build statics 3
    await Promise.map(
      cmpPaths,
      cp => {
        logger.silly('building', cp)
        tracker.completeWork(1)
        return buildCmpStatics({ 'contextRoot': cp, 'output': contextRoot, lifecycle })
      },
      // must 1, because config/stories.js
      { 'concurrency': 3 }
    ).then(() => {

      tracker.finish()
    })
  }

  _private_getCmpPackages() {
    const { contextRoot, independent } = this.options
    const rc = new ReadRC({ contextRoot })
    const packageGraph = new PackageGraph({
      contextRoot,
      'paths': independent ? rc.getComponentsPath() : [ contextRoot ]
    })
    return packageGraph.packages
  }
}
