import path from 'path'
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

  _private_resolve (compoesePath) {
    const packinfo = require(`${this.contextRoot}/package.json`)

    // 使用者通过 source 控制命令执行路径
    let contextRoot = this.contextRoot
    if (this.options.source) {
      contextRoot = path.join(this.contextRoot, this.options.source)
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
