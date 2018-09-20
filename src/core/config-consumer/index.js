
import fs, { readdirSync, lstatSync } from 'fs'
import ejs from 'ejs'
import path from 'path'
import execa from 'execa'
import ReadRC from '../read-rc'
import copydir from '../../helpers/copy-dir'

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
    copydir(oriConfigPath, this.storybookConfigPath)

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

  generateHttpHAREntry(httpHARPath) {
    if (!httpHARPath) {
      return false
    }

    if (httpHARPath) {
      httpHARPath = path.join(this.contextRoot, httpHARPath)
    } else {
      httpHARPath = this.contextRoot
    }

    if (!fs.existsSync(httpHARPath)) {
      return false
    }

    let entries = []
    fs.readdirSync(httpHARPath)
      .filter(filename => !filename.match(/^\./))
      .forEach(filename => {
        const harHttpJson = require(path.join(httpHARPath, filename))
        entries.push(harHttpJson)
      })

    fs.writeFileSync(
      `${this.storybookConfigPath}/http-mock/https.json`,
      JSON.stringify({
        'log': {
          'version': '0.0.1',
          'creator': {
            'name': '@beisen/http-mocker',
            'version': '0.0.1'
          },
          'pages': {},
          'entries': entries
        }
      }, null, 2),
      'utf8'
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

