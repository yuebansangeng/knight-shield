
import fg from 'fast-glob'
import Generator from 'yeoman-generator'
import updatePackages from './update-packages'
import publishNpm from './publish-npm'
import gitCheckout from './git-checkout'

export default class extends Generator {
  async writing () {
    const { rc, contextRoot, onlyUpdated, independent } = this.options
    const packinfo = this.options.package

    // components is sub of workspaces
    // there mabe some another module which is not component，but independent npm module
    let cmpPaths = fg.sync(rc.workspaces || rc.components, { 'onlyDirectories': true })

    if (onlyUpdated) {
      cmpPaths = await collectUpdates({ contextRoot, independent, rc })
    }

    let { packages } = updatePackages({ cmpPaths, contextRoot, 'package': packinfo })

    publishNpm({ packages })
      .then(() => gitCheckout())
  }
}
