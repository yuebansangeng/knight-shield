
import path from 'path'
import Generator from 'yeoman-generator'
import publishNpm from './publish-npm'
import gitCheckout from './git-checkout'
import ReadRC from '../../../helpers/read-rc'
import collectUpdates from '../../../helpers/collect-updates'
import readPackage from '../../../helpers/read-package'
import PackageGraph from '../../../helpers/package-graph'

export default class extends Generator {
  async writing () {
    const { contextRoot, onlyUpdated, independent } = this.options
    const packinfo = this.options.package
    const rc = new ReadRC({ contextRoot })

    // independent
    let cmpPaths = independent ? rc.getPublishModulesPath() : [ contextRoot ]

    if (onlyUpdated) {
      cmpPaths = await collectUpdates({
        contextRoot,
        // 'false': only need relative path, for git diff check
        'cmpPaths': independent ? rc.getPublishModulesPath(false) : [ '.' ]
      })
    }

    // get packs' name for publish filter
    const publishCmpNames = cmpPaths.map(cp => readPackage(path.join(cp, 'package.json')).name)

    const pkgGraph = new PackageGraph({
      contextRoot,
      'paths': independent ? rc.getLocalModulesPath() : [ contextRoot ]
    })

    // TODO: update updated module
    pkgGraph.updatePackages(publishCmpNames, packinfo.version)

    // generate all local packs, for lerna update deps' version
    const localPackages = pkgGraph.getLocalPackages()

    await publishNpm({ localPackages, publishCmpNames })
      .then(() => gitCheckout())
  }
}
