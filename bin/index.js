
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
        console.log(`${fkey} copied`)
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

  // 生成 lib 目录，以及内部转义好的文件
  await new Promise((resolve, reject) => {
    // 执行 gulp 命令
    let cp_n = spawn('node', [
      'node_modules/gulp/bin/gulp.js',
      // 调整 gulpfile 配置文件的获取路径
      '--gulpfile', path.join(__dirname, '..', 'lib', 'gulpfile.js'),
      // 重定向 gulp 命令执行的路径到组件项目根目录
      '--cwd', cpath,
      '--colors'
    ], { 'cwd': cpath })
    // 监听返回值，close时结束
    cp_n.stdout.on('data', data => colorLog(data))
    cp_n.stderr.on('data', err_data => colorLog(err_data))
    cp_n.stderr.on('close', () => {
      resolve(true)
    })
  })

  // 运行 storyrbooks 调试环境
  // 使用 spwan 执行，需要和 gulp watch 命令并行执行
  print(spawn('start-storybook', [ '-s', '.', '-p', '9001', '-c', path.join(__dirname, '..', 'lib') ], { 'cwd': cpath }))

  // 监控文件目录变化
  // 使用 spwan 执行，需要和 start-storybook 命令并行执行
  print(spawn('node', [
    'node_modules/gulp/bin/gulp.js',
    // 调整 gulpfile 配置文件的获取路径
    '--gulpfile', path.join(__dirname, '..', 'lib', 'gulpfile.js'),
    // 重定向 gulp 命令执行的路径到组件项目根目录
    '--cwd', cpath,
    'watch',
    '--colors'
    ], { 'cwd': cpath }))

  // 打开本地调试浏览器
  spawn('/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome', ['--enable-speech-input', 'http://localhost:9001'])
    .stderr.on('data', data => console.log(`请使用MacOS系统`.red))
}

main()
