
const { spawn } = require('child_process')
const colors = require('colors')
const shelljs = require('shelljs')
const path = require('path')
const fs = require('fs')

// cpath 组件调用命令传入的路径
let [ a, b, cpath ] = process.argv

function colorLog (data) {
  let printStr = `${data}`
  if (printStr.match(/Storybook started on/ig)) {
    printStr = `${printStr}`.green
  }
  process.stdout.write(printStr)
} 

function print (chilprocess) {
  chilprocess.stdout.on('data', data => colorLog(data))
  chilprocess.stderr.on('data', err_data => colorLog(err_data))
}

print(spawn('node', ['make-stories.js', cpath, '--colors'], { 'cwd': __dirname }))
print(spawn('node', ['make-demos.js', cpath, '--colors'], { 'cwd': __dirname }))

// 生成 lib 目录，以及内部转义好的文件
print(spawn('gulp', ['--colors'], { 'cwd': cpath }))

// 判断组件内部是否配置storybooks配置
// 配置了则不适用内部的 storybook-lib config
let cpathStbkFlod = path.join(cpath, '.storybook')
let stbPreArgs = [ '-s', '.', '-p', '9001', '-c' ]
if (fs.existsSync(cpathStbkFlod)) {
  console.log(`已检测到在项目中出现.storybook文件夹，程序将不再使用默认storybook配置，请自行配置storybook.`.yellow)
  print(spawn('start-storybook', stbPreArgs.concat([ cpathStbkFlod ]), { 'cwd': cpath }))
} else {
  // 生成 config 文件
  print(spawn('node', ['make-config.js', cpath, '--colors'], { 'cwd': __dirname }))
  print(spawn('start-storybook', stbPreArgs.concat([ path.join(__dirname, '..', 'src') ]), { 'cwd': cpath }))
}

// 监控文件目录变化
print(spawn('gulp', ['watch', '--colors'], { 'cwd': cpath })) 

// 打开本地调试浏览器
spawn('/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome', ['--enable-speech-input', 'http://localhost:9001'])
  .stderr.on('data', data => console.log(`请使用MacOS系统`.red))
