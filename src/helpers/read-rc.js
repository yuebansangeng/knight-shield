
import fs from 'fs'
import fg from 'fast-glob'
import Hjson from 'hjson'

export default class ReadRC {

  constructor (props = {}) {
    this.fileNames = [ '.bscpmrc', '.bscpmrc.json' ]
    this.contextRoot = props.contextRoot || process.cwd()
    this.fsGlobOps = { 'onlyDirectories': true }
  }

  toJSON () {
    let packInfo = this.extractRCFromPakcage()
    let rc = {}
    for (let filename of this.fileNames) {
      if (fs.existsSync(`${this.contextRoot}/${filename}`)) {
        rc = Hjson.parse(fs.readFileSync(`${this.contextRoot}/${filename}`, 'utf-8'))
        break
      }
    }
    return Object.assign({}, packInfo, rc)
  }

  get (key) {
    return this.toJSON()[key]
  }

  getComponentsPath () {
    return fg.sync(this.toJSON().components, this.fsGlobOps)
  }

  getLibsPath () {
    const { components, libs } = this.toJSON()
    const libsPath = new Set(libs.concat(components)).keys()
    return fg.sync(libsPath, this.fsGlobOps)
  }

  getPackageInfo () {
    return fs.existsSync(`${this.contextRoot}/package.json`) &&
      require(`${this.contextRoot}/package.json`) || {}
  }

  extractRCFromPakcage () {
    const { maintainers = [], name, description } = this.getPackageInfo()
    const developers = maintainers.map(developer => developer.name)

    return {
      'name': name,
      'description': description,
      'developers': developers, // TODO: remove
      'team': 'Unknown',
      'components': [], // fs-glob
      'libs': [],       // fs-glob
      'privates': [],   // fs-glob
      'category': '',
      'device': '',
      'mock': {
        'https': ''
      }
    }
  }
}
