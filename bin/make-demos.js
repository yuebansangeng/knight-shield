
const path = require('path')
const fs = require('fs')
const { getDemos } = require('./utils')

// cpath 组件调用命令传入的路径
let [ a, b, cpath ] = process.argv

const buildFolderPath = path.join(cpath, '.build')
if (!fs.existsSync(buildFolderPath)) {
  fs.mkdirSync(buildFolderPath)
}

// 创建demos的名字的文件，提供给组件共享平台使用
let demosFileContent = getDemos(path.join(cpath, 'demos')).map(({ name }) => ({ name: name }))
fs.writeFile(path.join(cpath, '.build', '.demos'), JSON.stringify(demosFileContent), (err) => {
  if (err) throw err
  console.log('the .demos file is saved!')
})
