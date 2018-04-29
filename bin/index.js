
const { spawn } = require('child_process')
const colors = require('colors')
const shelljs = require('shelljs')
const path = require('path')

// cpath 组件调用命令传入的路径
let [ a, b, cpath ] = process.argv

// 判断组件内部是否配置storybooks配置
// 配置了则不适用内部的 storybook-lib config
// if (fs.existsSync(path.join(cpath, '.storybook'))) {
//   shelljs.exec(`start-storybook -s . -p 9001 -c ${cpath}/.storybook`)
// } else {
//   shelljs.exec(`start-storybook -s . -p 9001 -c ../.config.js`)
// }

print(spawn('node', ['make-demos.js', cpath], { 'cwd': __dirname }))
print(spawn('gulp', [], { 'cwd': cpath }))
print(spawn('start-storybook', ['-s', '.', '-p', '9001', '-c', path.join(__dirname, '..', 'src')], { 'cwd': cpath }))
print(spawn('gulp', ['watch'], { 'cwd': cpath }))

// 打开本地调试浏览器
const openChrome_process = spawn('/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome', ['--enable-speech-input', 'http://localhost:9001'])
openChrome_process.stderr.on('data', data => console.log(`尝试打开Chrome浏览器：${data}`.red))


function print (chilprocess) {
  chilprocess.stdout.on('data', data => console.log(`${data}`.green))
  chilprocess.stderr.on('data', data => console.log(`${data}`.yellow))
}
