
const assert = require('assert')
const path = require('path')

describe('工具类测试', () => {

  it('测试输出 stories.js 配置文件', async () => {
     process.chdir(`${__dirname}/component`)
     require('../lib/make-stories.js')({
       'stoiresEjsTemplatePath': path.join(__dirname, '..', 'lib', '.storybook', 'stories.ejs'),
       'targetStoireJsPath': `${__dirname}/stories.js`
     }).then(res => {
      console.log(res)
     })
  })
})
