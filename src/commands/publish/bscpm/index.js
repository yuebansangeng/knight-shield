
import Promise from 'bluebird'
import Generator from 'yeoman-generator'
import singlePub from './single-pub'
import logger from '../../../helpers/logger'
import ReadRC from '../../../core/read-rc'
import PackageGraph from '../../../core/package-graph'

export default class extends Generator {

  async writing () {
    const { independent, contextRoot, onlyUpdated, username, 'package': packinfo } = this.options
    const rc = new ReadRC({ contextRoot })
    const cmpPackageGraph = this._private_getCmpPackageGraph(rc)
    let cmpPackages = cmpPackageGraph.packages
    

    this._private_updatePackages(rc)

    // only-updated
    if (onlyUpdated) {
      cmpPackages = cmpPackageGraph.collectUpdates()
    }

    logger.enableProgress()
    let tracker = logger.newItem('publishing', cmpPackages.length)

    // publish metadata
    await Promise.map(
      cmpPackages,
      ({ location }) => {

        logger.silly('publishing', location)
        tracker.completeWork(1)

        return singlePub({ 'contextRoot': location, username })
      },
      { 'concurrency': 3 }
    ).then(() => {

      tracker.finish()
    })
    .catch(err => console.log(err))
  }

  _private_updatePackages(rc) {
    const { contextRoot, independent, 'package': packinfo } = this.options
    const packageGraph = new PackageGraph({
      contextRoot,
      'paths': independent ? rc.getLocalModulesPath() : [ contextRoot ]
    })
    packageGraph.updatePackages(null, packinfo.version)
  }

  _private_getCmpPackageGraph(rc) {
    const { contextRoot, independent } = this.options
    return new PackageGraph({
      contextRoot,
      'paths': independent ? rc.getComponentsPath() : [ contextRoot ]
    })
  }
}
