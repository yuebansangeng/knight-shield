
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
    const cmpPackageGraph = this._private_getCmpPackageGraph(rc)
    let cmpPackages = cmpPackageGraph.packages


    this._private_updatePackages(rc)

    if (onlyUpdated) {
      cmpPackages = cmpPackageGraph.collectUpdates()
    }

    logger.enableProgress()
    let tracker = logger.newItem('building', cmpPackages.length)

    // build statics 3
    await Promise.map(
      cmpPackages,
      ({ location }) => {

        logger.silly('building', location)
        tracker.completeWork(1)

        return buildCmpStatics({
          'contextRoot': location,
          'output': contextRoot,
          'configerRoot': contextRoot, // where to get configs
          lifecycle,
        })
      },
      // must 1, because config/stories.js
      { 'concurrency': 3 }
    ).then(() => {

      tracker.finish()
    })
  }

  _private_updatePackages(rc) {
    const { contextRoot, independent, 'package': packinfo } = this.options
    const packageGraph = new PackageGraph({
      contextRoot,
      'paths': independent ? rc.getLocalModulesPath() : [ contextRoot ]
    })
    packageGraph.updatePackages(packinfo.version)
  }

  _private_getCmpPackageGraph(rc) {
    const { contextRoot, independent } = this.options
    return new PackageGraph({
      contextRoot,
      'paths': independent ? rc.getComponentsPath() : [ contextRoot ]
    })
  }
}
