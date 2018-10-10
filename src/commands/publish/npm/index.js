
import path from 'path'
import Generator from 'yeoman-generator'
import publishNpm from './publish-npm'
import gitCheckout from './git-checkout'
import ReadRC from '../../../core/read-rc'
import PackageGraph from '../../../core/package-graph'

export default class extends Generator {

  async writing () {
    const { contextRoot, onlyUpdated, independent } = this.options
    const packinfo = this.options.package
    const rc = new ReadRC({ contextRoot })
    const publishPackageGraph = this._private_getPublishPackageGraph(rc)
    let publishPackages = publishPackageGraph.packages


    this._private_updatePackages(rc)

    if (onlyUpdated) {
      publishPackages = publishPackageGraph.collectUpdates()
    }

    await publishNpm({ 'packages': publishPackages })
  }

  _private_updatePackages(rc) {
    const { contextRoot, independent, 'package': packinfo } = this.options
    const packageGraph = new PackageGraph({
      contextRoot,
      'paths': independent ? rc.getLocalModulesPath() : [ contextRoot ]
    })
    packageGraph.updatePackages(null, packinfo.version)
  }

  _private_getPublishPackageGraph(rc) {
    const { contextRoot, independent } = this.options
    return new PackageGraph({
      contextRoot,
      'paths': independent ? rc.getPublishModulesPath() : [ contextRoot ]
    })
  }
}
