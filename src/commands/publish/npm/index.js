
import Generator from 'yeoman-generator'
import updatePackages from './update-pakcages'

export default class extends Generator {

  async writing () {
    const { rc, contextRoot, onlyUpdated } = this.options
    const packinfo = this.options.package

    updatePackages({ rc, contextRoot, 'package': packinfo })

  }
}
