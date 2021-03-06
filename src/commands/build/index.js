
import path from 'path'
import Generator from 'yeoman-generator'

export default class extends Generator {

  constructor (args, opts) {
    super(args, opts)
    this.argument('cmd', { 'type': String, 'required': true })
  }

  composing () {
    this._private_resolve(`./${this.options.cmd}/index.js`)
  }

  _private_resolve (compoesePath) {
    let packinfo = require(`${this.contextRoot}/package.json`)
    let contextRoot = this.contextRoot

    // change work path
    let { source } = this.options
    if (source) {
      contextRoot = source.match(/^\//) ? source : path.join(this.contextRoot, source)
      packinfo = require(`${contextRoot}/package.json`)
    }

    this.composeWith(
      require.resolve(compoesePath),
      Object.assign(
        { },
        this.options,
        {
          'package': packinfo,
          contextRoot
        }
      )
    )
  }
}
