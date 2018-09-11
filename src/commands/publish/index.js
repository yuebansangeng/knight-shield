
import path from 'path'
import Generator from 'yeoman-generator'
import readrc from '../../helpers/read-rc'
import { spawnSync } from 'child_process'
import fs from 'fs'

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
    //修改rc文件
    const { stdout } = spawnSync('git', ['config', 'user.name'])
    let username = `${stdout}`.replace(/^\s+|\s+$/, '')

    let rcinfo =  JSON.parse(fs.readFileSync(`${this.contextRoot}/.bscpmrc`,'utf-8'));

    let developers = Array.isArray(rcinfo.developers) ? rcinfo.developers : []

    rcinfo.developers = developers.includes(`${username}`) ? developers  : developers.concat(`${username}`)

    fs.writeFileSync(`${this.contextRoot}/.bscpmrc`, JSON.stringify(rcinfo,null,2),'utf-8'); 

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