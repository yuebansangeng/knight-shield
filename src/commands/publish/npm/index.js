
import fg from 'fast-glob'
import Generator from 'yeoman-generator'
import getPackages from './get-packages'
import updatePackages from './update-packages'
import publishNpm from './publish-npm'
import gitCheckout from './git-checkout'
import ReadRC from '../../../helpers/read-rc'
import collectUpdates from '../../../helpers/collect-updates'

export default class extends Generator {

  async writing () {
    const { contextRoot, onlyUpdated, independent } = this.options
    const packinfo = this.options.package
    const rc = new ReadRC({ contextRoot })

    let cmpPaths = independent ? rc.getPublishModulesPath() : [ contextRoot ]

    if (onlyUpdated) {
      cmpPaths = await collectUpdates({
        contextRoot,
        'cmpPaths': independent ? rc.getPublishModulesPath(false) : [ '.' ]
      })
    }

    let packages = getPackages({ cmpPaths, contextRoot })

    console.log(packages)
    return

    updatePackages({ contextRoot, packages, 'version': packinfo.version })

    await publishNpm({ packages })
      .then(() => gitCheckout())
  }
}
