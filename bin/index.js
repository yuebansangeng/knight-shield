
const { spawn, spawnSync } = require('child_process')
const path = require('path')
const fs = require('fs')
const ejs = require('ejs')
const { getCmpName, getDemos, colorLog, print } = require('./utils')

let main = async () => {

  // cpath 组件调用命令传入的路径
  cpath = process.cwd()

  // 如何开发者配置了自定义文件，则复制进src
  await new Promise((resolve, reject) => {
    let configfiles = {
      'manager-head.html': `${cpath}/.storybook/manager-head.html`,
      'preview-head.html': `${cpath}/.storybook/preview-head.html`,
      'webpack.config.js': `${cpath}/.storybook/webpack.config.js`
    }
    Object.keys(configfiles).forEach(fkey => {
      if (fs.existsSync(configfiles[fkey])) {
        let content = fs.readFileSync(configfiles[fkey], 'utf8')
        if (fkey === 'webpack.config.js') {
          fs.writeFileSync(path.join(__dirname, '..', 'lib', 'webpack.extend.config.js'), content, 'utf8')
        } else {
          fs.writeFileSync(path.join(__dirname, '..', 'lib', fkey), content, 'utf8')  
        }
      }
    })
    resolve(true)
  })

  // 配置 运行环境 需要的 stories 配置问题
  await new Promise((resolve, reject) => {
    ejs.renderFile(
      path.join(__dirname, '..', 'lib', 'templates', 'stories.ejs'),
      {
        'examples': getDemos(path.join(cpath, 'examples')),
        'cmpName': getCmpName(path.join(cpath, 'package.json')),
        'cpath': cpath
      },
      { }, // ejs options
      (err, storiesjs) => {
        if (err) throw err
        // 在组建项目中创建配置文件
        fs.writeFile(path.join(__dirname, '..', 'lib', 'stories.js'), storiesjs, (err) => {
          if (err) {
            console.log(err)
            return reject(false)
          }
          resolve(true)
        })
      }
    )
  })

  // 运行 storyrbooks 调试环境
  // 使用 spwan 执行，需要和 gulp watch 命令并行执行
  print(spawn('start-storybook', [ '-s', '.', '-p', '9001', '-c', path.join(__dirname, '..', 'lib') ], { 'cwd': cpath }))

  // 打开本地调试浏览器
  spawn('/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome', ['--enable-speech-input', 'http://localhost:9001'])
    .stderr.on('data', data => console.log(`请使用MacOS系统`.red))
}

main()
