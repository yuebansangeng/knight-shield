
const { lstatSync, readdirSync } = require('fs')
const { join } = require('path')
const fs = require('fs')
const path = require('path')
const colors = require('colors')

let colorLog = (data) => {
  let printStr = `${data}`
  if (printStr.match(/Storybook started on/ig)) {
    printStr = `${printStr}`.green
  }
  process.stdout.write(printStr)
}

module.exports = {

  getCmpName: (path) => {
    return require(path).name
      .replace('@beisen-cmps/', '')
      .replace(/-(\w)/g, (all, letter) => letter.toUpperCase())
      .replace(/^\w/, (all, letter) => all.toUpperCase())
  },

  getDemos: (source) => {
    return readdirSync(source)
      .map(name => join(source, name))
      .filter(source => lstatSync(source).isDirectory())
      .map(name => {
        return {
          'name': name.split('\/')[name.split('\/').length - 1],
          'hasEditableProps': !!fs.existsSync(path.join(name, 'editable-props.js')),
          'hasDoc': !!fs.existsSync(path.join(name, 'doc.md'))
        }
      })
  },

  colorLog: colorLog,

  print: (cp) => {
    let self = this
    cp.stdout.on('data', data => colorLog(data))
    cp.stderr.on('data', err_data => colorLog(err_data))
  }
}
