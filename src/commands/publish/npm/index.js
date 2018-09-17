
import Generator from 'yeoman-generator'
import updatePackages from './update-pakcages'
import publishPackages from './publish-pakcages'
import gitCheckout from './git-checkout'

export default class extends Generator {
  async writing () {
    const { rc, contextRoot, onlyUpdated } = this.options
    const packinfo = this.options.package

    let { packages } = updatePackages({ rc, contextRoot, 'package': packinfo })

    publishPackages({ packages })

    gitCheckout()
  }
}
