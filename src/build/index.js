
const ejs = require('ejs')
const path = require('path')
const fs = require('fs')
const { lstatSync, readdirSync } = require('fs')
const { join } = require('path')

// cpath 组件调用命令传入的路径
let [ a, b, cpath ] = process.argv

// 获取目录下文件夹的名字
const getDemos =
  source =>
    readdirSync(source)
      .map(name => join(source, name))
      .filter(source => lstatSync(source).isDirectory())
      .map(name => name.split('\/')[name.split('\/').length - 1])
      .map(name => ({ 'name': name }))

ejs.renderFile(
  path.join(__dirname, 'stories.ejs'),
  {
    'demos': getDemos(path.join(cpath, 'demos')),
    'cmpRootPath': cpath
  },
  {}, // ejs options
  (err, str) => {
    if (err) throw err

    fs.writeFile(path.join(__dirname, '..', 'stories.js'), str, (err) => {
      if (err) throw err

      console.log('the entry file is saved!')
    })
  }
)
