
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
        'cmpName': getCmpName(path.join(cpath, 'package.json'))
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
    let cp_n = spawn('node', [ 'node_modules/gulp/bin/gulp.js', '--colors'], { 'cwd': cpath })
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
  print(spawn('node', [ 'node_modules/gulp/bin/gulp.js', 'watch', '--colors'], { 'cwd': cpath }))

  // 运行 storyrbooks 调试环境
  print(spawn('start-storybook', stbPreArgs, { 'cwd': cpath }))

  // 打开本地调试浏览器
  spawn('/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome', ['--enable-speech-input', 'http://localhost:9001'])
    .stderr.on('data', data => console.log(`请使用MacOS系统`.red))
}

main()
