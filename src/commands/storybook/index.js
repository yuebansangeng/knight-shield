
import path from 'path'
import Generator from 'yeoman-generator'
import ReadRC from '../../helpers/read-rc'
import logger from '../../helpers/logger'

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

    let { source } = this.options
    if (source) {
      contextRoot = source.match(/^\//) ? source : path.join(this.contextRoot, source)
      packinfo = require(`${contextRoot}/package.json`)
    }

    let rc = new ReadRC({ contextRoot })
   
    this.composeWith(
      require.resolve(compoesePath),
      Object.assign(
        {},
        this.options,
        {
          'rc': rc.toJSON(),
          'package': packinfo,
          contextRoot,
          logger
        }
      )
    )
  }
}
