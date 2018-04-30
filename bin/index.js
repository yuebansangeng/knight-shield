
const { spawn } = require('child_process')
const colors = require('colors')
const shelljs = require('shelljs')
const path = require('path')

// cpath 组件调用命令传入的路径
let [ a, b, cpath ] = process.argv

function print (chilprocess) {
  chilprocess.stdout.on('data', data => console.log(`${data}`.green))
  chilprocess.stderr.on('data', data => console.log(`${data}`.yellow))
}


print(spawn('node', ['make-config.js', cpath], { 'cwd': __dirname }))
print(spawn('node', ['make-stories.js', cpath], { 'cwd': __dirname }))
print(spawn('node', ['make-demos.js', cpath], { 'cwd': __dirname }))

// 生成 lib 目录，以及内部转义好的文件
print(spawn('gulp', [], { 'cwd': cpath }))

// 判断组件内部是否配置storybooks配置
// 配置了则不适用内部的 storybook-lib config
// let cpathStbkFlod = path.join(cpath, '.storybook')
let stbPreArgs = [ '-s', '.', '-p', '9001', '-c' ]
// if (fs.existsSync(cpathStbkFlod)) {
//   print(spawn('start-storybook', stbPreArgs.concat([ cpathStbkFlod ]), { 'cwd': cpath }))
// } else {
  print(spawn('start-storybook', stbPreArgs.concat([ path.join(__dirname, '..', 'src') ]), { 'cwd': cpath }))
// }

// 监控文件目录变化
print(spawn('gulp', ['watch'], { 'cwd': cpath })) 

// 打开本地调试浏览器
spawn('/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome', ['--enable-speech-input', 'http://localhost:9001'])
  .stderr.on('data', data => console.log(`请使用MacOS系统`.red))
