
import fg from 'fast-glob'
import Generator from 'yeoman-generator'
import getPackages from './get-packages'
import updatePackages from './update-packages'
import publishNpm from './publish-npm'
import gitCheckout from './git-checkout'
import ReadRC from '../../../helpers/read-rc'

const fgOps = { 'onlyDirectories': true }

export default class extends Generator {

  async writing () {
    const { contextRoot, onlyUpdated, independent } = this.options
    const packinfo = this.options.package
    const rc = new ReadRC({ contextRoot })

    // & filter private module
    let cmpPaths = rc.getPublishModulesPath()

    if (onlyUpdated) {
      cmpPaths = await collectUpdates({ contextRoot, independent, rc })
    }

    let packages = getPackages({ cmpPaths, contextRoot })

    updatePackages({ contextRoot, packages, 'version': packinfo.version })

    await publishNpm({ packages })
      .then(() => gitCheckout())
  }
}
