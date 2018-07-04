
const { spawn, spawnSync } = require('child_process')
const path = require('path')
const fs = require('fs')
const ejs = require('ejs')
const { lstatSync, readdirSync } = require('fs')
const colors = require('colors')
const argv = require('minimist')(process.argv.slice(2))

let getDemos = (source) => {
  return readdirSync(source)
    .map(name => path.join(source, name))
    .filter(source => lstatSync(source).isDirectory())
    .map(name => {
      return {
        'name': name.split('\/')[name.split('\/').length - 1],
        'hasEditableProps': !!fs.existsSync(path.join(name, 'editable-props.js')),
        'hasDoc': !!fs.existsSync(path.join(name, 'doc.md'))
      }
    })
}

let colorLog = (data) => {
  let printStr = `${data}`
  if (printStr.match(/Storybook started on/ig)) {
    printStr = `${printStr}`.green
  }
  process.stdout.write(printStr)
}

let print = (cp) => {
  cp.stdout.on('data', data => colorLog(data))
  cp.stderr.on('data', err_data => colorLog(err_data))
}

// cpath 组件调用命令传入的路径
let cpath = process.cwd()

let main = async () => {

  // 如何开发者配置了自定义文件，则复制进src
  await new Promise((resolve, reject) => {
    let configfiles = {
      'manager-head.html': `${cpath}/.storybook/manager-head.html`,
      'preview-head.html': `${cpath}/.storybook/preview-head.html`,
      'webpack.config.js': `${cpath}/.storybook/webpack.config.js`
    }
    Object.keys(configfiles).forEach(fkey => {
      if (fs.existsSync(configfiles[fkey])) {
        let content = fs.readFileSync(configfiles[fkey], 'utf8')
        if (fkey === 'webpack.config.js') {
          fs.writeFileSync(path.join(__dirname, '..', 'lib', 'webpack.extend.config.js'), content, 'utf8')
        } else {
          fs.writeFileSync(path.join(__dirname, '..', 'lib', fkey), content, 'utf8')  
        }
      }
    })
    resolve(true)
  })

  // 如果开发者配置了 tsconfig，则copy配置文件
  await new Promise((resolve, reject) => {
    let configFile = 'tsconfig.json'
    if (fs.existsSync(`${cpath}/${configFile}`)) {
      let content = fs.readFileSync(`${cpath}/${configFile}`, 'utf8')
      fs.writeFileSync(path.join(__dirname, '..', 'lib', configFile), content, 'utf8')  
    }
    resolve(true)
  })

  // 如果开发者配置了 babelrc，则copy配置文件
  await new Promise((resolve, reject) => {
    let babelrcFile = '.babelrc'
    if (fs.existsSync(`${cpath}/${babelrcFile}`)) {
      let content = fs.readFileSync(`${cpath}/${babelrcFile}`, 'utf8')
      // 转换JSON格式后，再次转换，避免 .json 格式引用出错
      let contentJsonText = ''
      try {
        let contentJson = JSON.parse(content)
        contentJsonText = JSON.stringify(contentJson, null, 2)
      } catch (e) {
        return console.log('.babelrc 文件内容异常，不是标准JSON结构')
      }
      fs.writeFileSync(path.join(__dirname, '..', 'lib', 'babelrc.json'), contentJsonText, 'utf8')  
    }
    resolve(true)
  })

  // 配置 运行环境 需要的 stories 配置问题
  await new Promise((resolve, reject) => {
    ejs.renderFile(
      path.join(__dirname, '..', 'lib', 'templates', 'stories.ejs'),
      {
        'examples': getDemos(path.join(cpath, 'examples')),
        'cpath': cpath
      },
      { }, // ejs options
      (err, storiesjs) => {
        if (err) throw err
        // 在组建项目中创建配置文件
        fs.writeFile(path.join(__dirname, '..', 'lib', 'stories.js'), storiesjs, (err) => {
          if (err) {
            console.log(err)
            return reject(false)
          }
          resolve(true)
        })
      }
    )
  })

  // 运行 storyrbooks 调试环境
  // 使用 spwan 执行，需要和 gulp watch 命令并行执行
  // buildonly 只构建配置，不启动调试环境
  if (!argv.buildonly) {
    print(
      spawn('start-storybook',
        [
          '-s', '.',
          '-p', '9001',
          '-c', path.join(__dirname, '..', 'lib')
        ], 
        // tsconfig.json 的配置以及
        // ts-loader 模块获取需要在 dirname
        { 'cwd': path.join(__dirname, '..') }
      )
    )
  } else {
    console.log('配置文件生成完毕')
  }

}

main()
