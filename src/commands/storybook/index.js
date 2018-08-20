
import Generator from 'yeoman-generator'
import readrc from '@beisen/read-rc'

export default class extends Generator {

  constructor (args, opts) {
    super(args, opts)
    this.argument('cmd', { 'type': String, 'required': true })
  }

  composing () {
    this._private_resolve(`./${this.options.cmd}/index.js`)
  }

  _private_resolve (path) {
    let rc = readrc()
    const packinfo = require(`${this.contextRoot}/package.json`)

    this.composeWith(
      require.resolve(path),
      Object.assign(
        {},
        this.options,
        {
          rc,
          'package': packinfo,
          'contextRoot': this.contextRoot
        }
      )
    )
  }
}
