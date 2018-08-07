
const assert = require('assert')
const path = require('path')

describe('工具类测试', () => {

  it('测试输出 stories.js 配置文件', () => {
     process.chdir(`${__dirname}/component`)
     require('../lib/make-stories.js')({
       'stoiresEjsTemplatePath': path.join(__dirname, '..', 'lib', '.storybook', 'stories.ejs'),
       'targetStoireJsPath': `${__dirname}/storybook-configs/stories.js`
     }).then(res => {
      console.log(res)
     })
  })

  it('复制开发者自定义配置文件', () => {
    let files = require('../lib/override-config.js')({
      'configPath': path.join(__dirname, 'component', '.storybook-test'),
      'destinationPath': path.join(__dirname, 'storybook-configs'),
      'configs': [
        'manager-head.html',
        'preview-head.html',
        'addons.js',
        'config.js',
        {
          'ori': 'webpack.config.js',
          'dest': 'webpack.extend.config.js'
        }
      ]
    })
    console.log(files)
  })
})