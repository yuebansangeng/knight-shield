
const assert = require('assert')
const path = require('path')

describe('units test', () => {

  // it('stories.js configs', () => {
  //    process.chdir(`${__dirname}/component`)
  //    require('../lib/make-stories.js')({
  //      'stoiresEjsTemplatePath': path.join(__dirname, '..', 'lib', 'stories.ejs'),
  //      'targetStoireJsPath': `${__dirname}/storybook-configs/stories.js`
  //    }).then(res => {
  //     console.log(res)
  //    })
  // })

  // it('copy configs', () => {
  //   let files = require('../lib/override-config.js')({
  //     'configPath': path.join(__dirname, 'component', '.storybook-test'),
  //     'destinationPath': path.join(__dirname, 'storybook-configs'),
  //     'configs': [
  //       'manager-head.html',
  //       'preview-head.html',
  //       'addons.js',
  //       'config.js',
  //       {
  //         'ori': 'webpack.config.js',
  //         'dest': 'webpack.extend.config.js'
  //       }
  //     ]
  //   })
  //   console.log(files)
  // })

  // it('test HTTP HAR entry', () => {
  //   require('../lib/generate-http-har-entry')({
  //     'cpath': `${__dirname}/component`,
  //     'httpHARPath': `./recordings`,
  //     'destinationPath': `${__dirname}/har.json`
  //   })
  // })
})
