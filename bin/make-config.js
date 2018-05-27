
const ejs = require('ejs')
const path = require('path')
const fs = require('fs')

// cpath 组件调用命令传入的路径
let [ a, b, cpath = process.cwd() ] = process.argv

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
      if (err) throw err
      // console.log('the config file is saved!')
    })
  }
)
