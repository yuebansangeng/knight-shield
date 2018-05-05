
const { spawn } = require('child_process')
const shelljs = require('shelljs')
const path = require('path')

let [ a, b, cpath ] = process.argv

function print (chilprocess) {
  chilprocess.stdout.on('data', data => console.log(`${data}`.green))
  chilprocess.stderr.on('data', data => console.log(`${data}`.yellow))
}

print(spawn('node', ['make-stories.js', cpath], { 'cwd': __dirname }))
print(spawn('node', ['make-demos.js', cpath], { 'cwd': __dirname }))

print(spawn('gulp', [], { 'cwd': cpath }))

print(spawn('node', ['make-config.js', cpath], { 'cwd': __dirname }))

shelljs.exec(`storybook-chrome-screenshot -p 9001 -c ${path.join(__dirname, '..', 'src')} -o ${cpath}/.build/.screenshot`)
