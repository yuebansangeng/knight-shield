
const ejs = require('ejs')
const path = require('path')
const fs = require('fs')
const { lstatSync, readdirSync } = require('fs')
const { join } = require('path')
const os = require('object-assign')

// cpath 组件调用命令传入的路径
let [ a, b, cpath ] = process.argv

// 获取组件名
var getCmpName = 
  path => 
    require(path).name
    .replace('@beisen-cmps/', '')
    .replace(/-(\w)/g, (all, letter) => letter.toUpperCase())
    .replace(/^\w/, (all, letter) => all.toUpperCase())

// 获取目录下文件夹的名字
var getDemos =
  source =>
    readdirSync(source)
      .map(name => join(source, name))
      .filter(source => lstatSync(source).isDirectory())
      .map(name => {
        return {
          'name': name.split('\/')[name.split('\/').length - 1],
          'hasEditableProps': !!fs.existsSync(path.join(name, 'editable-props.js'))
        }
      })

var readStoriesjs = (callback) => {
  ejs.renderFile(
    path.join(__dirname, 'stories.ejs'),
    {
      'demos': getDemos(path.join(cpath, 'demos')),
      'cmpName': getCmpName(path.join(cpath, 'package.json'))
    },
    {}, // ejs options
    (err, storiesjs) => {
      if (err) throw err
      callback(storiesjs)
    }
  )
}

const readConfigjs = (callback) => {
  ejs.renderFile(
    path.join(__dirname, 'config.ejs'),
    {
      'cmpRootPath': cpath
    },
    {}, // ejs options
    (err, configjs) => {
      if (err) throw err
      callback(configjs)
    }
  )
}

readStoriesjs(storiesjs => {
  readConfigjs(configjs => {

    // 创建config文件
    fs.writeFile(path.join(__dirname, '..', 'config.js'), configjs, (err) => {
      if (err) throw err
      console.log('the config file is saved!')

      const buildFolderPath = path.join(cpath, '.build')
      if (!fs.existsSync(buildFolderPath)) {
        fs.mkdirSync(buildFolderPath)
      }

      // 在组建项目中创建配置文件
      fs.writeFile(path.join(cpath, '.build', '.stories.js'), storiesjs, (err) => {
        if (err) throw err
        console.log('the stories file is saved!')
      })

      // 创建demos的名字的文件，提供给组件共享平台使用
      let demosFileContent = getDemos(path.join(cpath, 'demos')).map(({ name }) => ({ name: name }))
      fs.writeFile(path.join(cpath, '.build', '.demos'), JSON.stringify(demosFileContent), (err) => {
        if (err) throw err
        console.log('the .demos file is saved!')
      })
    })
  })
})
