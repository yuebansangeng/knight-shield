
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
    'demos': getDemos(path.join(cpath, 'demos'))
  },
  {}, // ejs options
  (err, storiesjs) => {
    if (err) throw err

    // 创建config文件
    ejs.renderFile(
    path.join(__dirname, 'config.ejs'),
    {
      'cmpRootPath': cpath
    },
    {}, // ejs options
    (err, str) => {
      if (err) throw err

      // 创建config文件
      fs.writeFile(path.join(__dirname, '..', 'config.js'), str, (err) => {
        if (err) throw err

        console.log('the config file is saved!')

        // 如何组件内部没有.build文件夹则创建一个
        var cbpath = path.join(cpath, '.build')
        if (!fs.existsSync(cbpath)) {
          fs.mkdirSync(cbpath)
        }

        // 在组建项目中创建配置文件
        fs.writeFile(path.join(cpath, '.build', '.stories.js'), storiesjs, (err) => {
          if (err) throw err

          console.log('the entry file is saved!')
        })
      })
    })
  }
)
