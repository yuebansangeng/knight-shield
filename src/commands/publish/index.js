
import path from 'path'
import Generator from 'yeoman-generator'
import readrc from '../../helpers/read-rc'


export default class extends Generator {

  constructor (args, opts) {
    super(args, opts)
    this.argument('cmd', { 'type': String, 'required': false, 'default': 'component' })
  }

  composing () {
    this._private_resolve(`./${this.options.cmd}/index.js`)
  }

  _private_resolve (compoesePath) {
    let packinfo = require(`${this.contextRoot}/package.json`)
    let contextRoot = this.contextRoot


    let { source } = this.options
    if (source) {
      contextRoot = source.match(/^\//) ? source : path.join(this.contextRoot, source)
      packinfo = require(`${contextRoot}/package.json`)
    }

    this.composeWith(
      require.resolve(compoesePath),
      Object.assign(
        {},
        this.options,
        {
          'rc': readrc(contextRoot),
          'package': packinfo,
          contextRoot
        }
      )
    )
  }
}
