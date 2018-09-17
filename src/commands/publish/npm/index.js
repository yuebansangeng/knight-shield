
import fg from 'fast-glob'
import Generator from 'yeoman-generator'
import getPackages from './get-packages'
import updatePackages from './update-packages'
import publishNpm from './publish-npm'
import gitCheckout from './git-checkout'

const fgOps = { 'onlyDirectories': true }


export default class extends Generator {

  async writing () {
    const { rc, contextRoot, onlyUpdated, independent } = this.options
    const { workspaces, components, privates } = rc
    const packinfo = this.options.package

    // components is sub of workspaces
    // there mabe some another module which is not component，but independent npm module
    let cmpPaths = fg.sync(workspaces || components, fgOps)

    if (onlyUpdated) {
      cmpPaths = await collectUpdates({ contextRoot, independent, rc })
    }

    // private module
    // some modules do not publish
    if (privates) {
      let privateModulePaths = fg.sync(privates, fgOps)
      let totalPMPaths = privateModulePaths.join(' ')
      // filter exists path
      cmpPaths = cmpPaths.filter(cp => !totalPMPaths.match(new RegExp(cp), 'ig'))
    }

    let packages = getPackages({ cmpPaths, contextRoot })

    updatePackages({ contextRoot, packages, 'version': packinfo.version })

    await publishNpm({ packages })
      .then(() => gitCheckout())
  }
}
