
import Generator from 'yeoman-generator'
import updatePackages from './update-pakcages'
import publishNpm from './publish-npm'
import gitCheckout from './git-checkout'

export default class extends Generator {
  async writing () {
    const { rc, contextRoot, onlyUpdated } = this.options
    const packinfo = this.options.package

    let { packages } = updatePackages({ rc, contextRoot, 'package': packinfo })

    publishNpm({ packages })

    gitCheckout()
  }
}
