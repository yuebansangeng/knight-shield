
import path from 'path'
import fg from 'fast-glob'
import Generator from 'yeoman-generator'
import getPackages from './get-packages'
import updatePackages from './update-packages'
import publishNpm from './publish-npm'
import gitCheckout from './git-checkout'
import ReadRC from '../../../helpers/read-rc'
import collectUpdates from '../../../helpers/collect-updates'
import readPackage from '../../../helpers/read-package'

export default class extends Generator {
  async writing () {
    const { contextRoot, onlyUpdated, independent } = this.options
    const packinfo = this.options.package
    const rc = new ReadRC({ contextRoot })

    // generate all local packs, for lerna update deps' version
    const localPackages = getPackages({
      contextRoot,
      'cmpPaths': independent ? rc.getLocalModulesPath() : [ contextRoot ]
    })

    // independent
    let cmpPaths = independent ? rc.getPublishModulesPath() : [ contextRoot ]

    if (onlyUpdated) {
      cmpPaths = await collectUpdates({
        contextRoot,
        'cmpPaths': independent ? rc.getPublishModulesPath(false) : [ '.' ]
      })
    }

    // get packs' name for publish filter
    let publishCmpNames = cmpPaths.map(cp => readPackage(path.join(cp, 'package.json')).name)

    // TODO: update updated module
    updatePackages({
      contextRoot,
      publishCmpNames,
      'packages': localPackages,
      'rootProjectVersion': packinfo.version
    })

    await publishNpm({ localPackages, publishCmpNames })
      .then(() => gitCheckout())
  }
}
