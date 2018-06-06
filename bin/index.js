
const { spawn, spawnSync } = require('child_process')
const path = require('path')
const fs = require('fs')
const ejs = require('ejs')
const { getCmpName, getDemos, colorLog, print } = require('./utils')

let main = async () => {

  // cpath 组件调用命令传入的路径
  cpath = process.cwd()

  // 配置 运行环境 需要的 stories 配置问题
  await new Promise((resolve, reject) => {
    ejs.renderFile(
      path.join(__dirname, '..', 'src', 'templates', 'stories.ejs'),
      {
        'examples': getDemos(path.join(cpath, 'examples')),
        'cmpName': getCmpName(path.join(cpath, 'package.json')),
        'cpath': cpath
      },
      { }, // ejs options
      (err, storiesjs) => {
        if (err) throw err
        // 在组建项目中创建配置文件
        fs.writeFile(path.join(__dirname, '..', 'src', 'stories.js'), storiesjs, (err) => {
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
      '--gulpfile', path.join(__dirname, 'gulpfile.js'),
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

  // 判断组件内部是否配置storybooks配置
  // 配置了则不适用内部的 storybook-lib config
  let cpathStbkFlod = path.join(cpath, '.storybook')
  let stbPreArgs = [ '-s', '.', '-p', '9001', '-c' ]

  if (fs.existsSync(cpathStbkFlod)) {

    stbPreArgs = stbPreArgs.concat([ cpathStbkFlod ])
    console.log(`已检测到在项目中出现.storybook文件夹，程序将不再使用默认storybook配置，请自行配置storybook.`.yellow)
  } else {

    // 生成 config 文件
    await new Promise((resolve, reject) => {
      ejs.renderFile(
        path.join(__dirname, '..', 'src', 'templates', 'config.ejs'),
        {
          'cmpRootPath': cpath
        },
        { }, // ejs options
        (err, configjs) => {
          if (err) throw err
          // 创建config文件
          fs.writeFile(path.join(__dirname, '..', 'src', 'config.js'), configjs, (err) => {
            if (err) {
              console.log(err)
              return reject(false)
            }
            resolve(true)
          })
        }
      )
    })

    stbPreArgs = stbPreArgs.concat([ path.join(__dirname, '..', 'src') ])
  }

  // 监控文件目录变化
  // 使用 spwan 执行，需要和 start-storybook 命令并行执行
  print(spawn('node', [
    'node_modules/gulp/bin/gulp.js',
    // 调整 gulpfile 配置文件的获取路径
    '--gulpfile', path.join(__dirname, 'gulpfile.js'),
    // 重定向 gulp 命令执行的路径到组件项目根目录
    '--cwd', cpath,
    'watch',
    '--colors'
    ], { 'cwd': cpath }))

  // 运行 storyrbooks 调试环境
  // 使用 spwan 执行，需要和 gulp watch 命令并行执行
  print(spawn('start-storybook', stbPreArgs, { 'cwd': cpath }))

  // 打开本地调试浏览器
  spawn('/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome', ['--enable-speech-input', 'http://localhost:9001'])
    .stderr.on('data', data => console.log(`请使用MacOS系统`.red))
}

main()
