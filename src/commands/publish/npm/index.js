
import path from 'path'
import Generator from 'yeoman-generator'
import publishNpm from './publish-npm'
import gitCheckout from './git-checkout'
import ReadRC from '../../../core/read-rc'
import collectUpdates from '../../../core/collect-updates'
import readPackage from '../../../helpers/read-package'
import PackageGraph from '../../../core/package-graph'

export default class extends Generator {
  async writing () {
    const { contextRoot, onlyUpdated, independent } = this.options
    const packinfo = this.options.package
    const rc = new ReadRC({ contextRoot })
    let modulePaths = independent ? rc.getLocalModulesPath() : [ contextRoot ]
    const packageGraph = new PackageGraph({ contextRoot, 'paths': modulePaths })


    packageGraph.updatePackages(null, packinfo.version)

    if (onlyUpdated) {
      let filteredPackages = this._private_getPublishPackages()
      modulesPaths = packageGraph.collectUpdates(filteredPackages)
    }

    // get packs' name for publish filter
    // const publishModuleNames = modulesPaths.map(cp => readPackage(path.join(cp, 'package.json')).name)

    // generate all local packs, for lerna update deps' version
    const localPackages = packageGraph.getLocalPackages()

    await publishNpm({ localPackages, moduleNames })
  }

  _private_getPublishPackages() {
    const { contextRoot, independent } = this.options
    const rc = new ReadRC({ contextRoot })
    const packageGraph = new PackageGraph({
      contextRoot,
      'paths': independent ? rc.getPublishModulesPath() : [ contextRoot ]
    })
    return packageGraph.packages
  }
}
