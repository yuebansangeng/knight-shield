
import fs, { readdirSync, lstatSync } from 'fs'
import ejs from 'ejs'
import path from 'path'
import execa from 'execa'
import ReadRC from '../read-rc'

// where config-* is
const configRoot = path.join(__dirname, '..', '..', '..', 'caches')
const oriConfigPath = path.join(__dirname, 'storybook')


export default class ConfigConsumer {

  constructor(props = {}) {
    this.contextRoot = props.contextRoot
    this.storybookConfigPath = `${configRoot}/config-${props.name}`
    // copy configs
    this.cloneConfigs()
  }

  getConfigPath() {
    return this.storybookConfigPath
  }

  cloneConfigs() {

    // create caches/ if none
    if (!fs.existsSync(configRoot)) {
      execa.sync('mkdir', [ configRoot ])
    }

    // create config dir
    if (fs.existsSync(this.storybookConfigPath)) {
      execa.sync('rm', [ '-rf', this.storybookConfigPath ])
    }

    execa.sync('mkdir', [ this.storybookConfigPath ])

    // copy config
    this.copydir(oriConfigPath, this.storybookConfigPath)

    // override storybook config
    this.override(
      `${this.contextRoot}/.storybook`,
      this.storybookConfigPath,
      [
        'manager-head.html',
        'preview-head.html',
        'addons.js',
        'config.js',
        {
          'ori': 'webpack.config.js',
          'dest': 'webpack.extend.config.js'
        }
      ]
    )
    // override default dev config
    this.override(
      this.contextRoot,
      this.storybookConfigPath,
      [
        'tsconfig.json',
        {
          'ori': '.babelrc',
          'dest': 'babelrc.json'
        }
      ]
    )
  }

  generateStoriesJs(cmpPaths) {
    return ejs.renderFile(
      path.join(__dirname, 'stories.ejs'),
      {
        'storyMetas': this.makeStoriesJson(cmpPaths)
      },
      {},
      (err, storiesjs) => {
        if (err) throw err
        fs.writeFile(path.join(this.storybookConfigPath, 'stories.js'), storiesjs, err => {
          if (err) return console.log(err)
        })
      }
    )
  }

  makeStoriesJson(cmpPaths) {
    return cmpPaths.map(contextRoot => {

      const packinfo = require(`${contextRoot}/package.json`)
      const examples = getExamples(contextRoot)
      const rc = new ReadRC({ contextRoot })

      let readme = ''
      if (fs.existsSync(`${contextRoot}/README.md`)) {
        readme = `require('${contextRoot}/README.md')`
      }

      let stories = []
      if (!examples.length) {
        stories.push({
          'name': 'default',
          'story': {
            'component': `require('${contextRoot}/src')`
          }
        })
      } else {
        stories = examples.map(exp => ({
          'name': exp.name,
          'story': {
            'component': `require('${contextRoot}/examples/${exp.name}')`
          }
        }))
      }

      return {
        'name': rc.get('name'),
        'stories': stories,
        'readme': readme
      }
    })
  }

  override (configPath, destinationPath, configs) {
    let retFilesPath = []

    configs.forEach(config => {
      const { ori = config, dest } = config
      const configFilePath = `${configPath}/${ori}`

      if (fs.existsSync(configFilePath)) {
        fs.writeFileSync(
          path.join(destinationPath, dest || ori),
          fs.readFileSync(configFilePath, 'utf8'),
          'utf8'
        )
        retFilesPath.push(configFilePath)
      }
    })

    return retFilesPath
  }

  copydir(srcDir, dstDir) {
    var results = []
    var list = fs.readdirSync(srcDir)
    var src, dst

    list.forEach(file => {
      src = srcDir + '/' + file
      dst = dstDir + '/' + file
      var stat = fs.statSync(src)
      if (stat && stat.isDirectory()) {
        try {
          fs.mkdirSync(dst)
        } catch (e) {
          console.log('directory already exists: ' + dst)
        }
        results = results.concat(this.copydir(src, dst))
      } else {
        try {
          fs.writeFileSync(dst, fs.readFileSync(src))
        } catch (e) {
          console.log('could\'t copy file: ' + dst)
        }
        results.push(src)
      }
    })
    return results
  }

  clean() {
    execa.sync('rm', [ '-rf', this.storybookConfigPath ])
  }
}

export const getExamples = (contextRoot) => {
  const epath = path.join(contextRoot, 'examples')

  if (!fs.existsSync(epath)) return []

  return readdirSync(epath)
    .map(name => path.join(epath, name))
    .filter(source => lstatSync(epath).isDirectory())
    .map(name => ({ 'name': name.split('\/')[name.split('\/').length - 1] }))
    .filter(file => !file.name.match(/^\./))
}

