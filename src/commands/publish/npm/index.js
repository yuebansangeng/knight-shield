
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

    // independent
    let localModulePaths = independent ? rc.getLocalModulesPath() : [ contextRoot ]

    const packageGraph = new PackageGraph({ contextRoot, 'paths': localModulePaths })

    if (onlyUpdated) {
      localModulePaths =
        packageGraph.collectUpdates(
          // filter private module
          independent ? rc.getPublishModulesPath() : [ contextRoot ]
        )
    }

    // get packs' name for publish filter
    const publishCmpNames = cmpPaths.map(cp => readPackage(path.join(cp, 'package.json')).name)

    // TODO: update updated module
    packageGraph.updatePackages(publishCmpNames, packinfo.version)

    // generate all local packs, for lerna update deps' version
    const localPackages = packageGraph.getLocalPackages()

    await publishNpm({ localPackages, publishCmpNames })
  }
}
