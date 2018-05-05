
const { spawn } = require('child_process')
const shelljs = require('shelljs')
const path = require('path')

let [ a, b, cpath ] = process.argv

// let chilprocess = spawn('storybook-chrome-screenshot', [ '-p', '9001', '-c', '../src', '-o', `${cpath}/.build/.screenshot` ])
// chilprocess.stdout.on('data', data => console.log(`${data}`.green))
// chilprocess.stderr.on('data', data => console.log(`${data}`.yellow))

shelljs.exec(`storybook-chrome-screenshot -p 9001 -c ${path.join(__dirname, '..', 'src')} -o ${cpath}/.build/.screenshot`)
