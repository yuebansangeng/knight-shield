
import { spawn, spawnSync } from 'child_process'
import { lstatSync, readdirSync } from 'fs'
import path from 'path'
import fs from 'fs'
import ejs from 'ejs'
import colors from 'colors'
import minimist from 'minimist'
import getdemos from './get-demos'
import colorlog from './color-log'
import Hjson from 'hjson'
import makeStories from './make-stories'


// 配置需要的参数，需要改动维护的几率比较高
const cpath = process.cwd() // cpath 组件调用命令传入的路径
const argv = minimist(process.argv.slice(2)) // 格式化传入参数 --port 5000 => { port: 5000 }
const storybookFolderName = '.storybook'
const storybookConfigPath = path.join(__dirname, storybookFolderName)
const port = argv.port || '9001'
const customConfigFolerPath = `${cpath}/${storybookFolderName}`
const customConfigFiles = { // 开发者自定义的配置文件
  'manager-head.html': { 'ori': 'manager-head.html' },
  'preview-head.html': { 'ori': 'preview-head.html' },
  'addons.js': { 'ori': 'addons.js' },
  'config.js': { 'ori': 'config.js' },
  '.babelrc': {
    'ori': '.babelrc',
    'dest': 'babelrc.json' // 转换成json文件，不需要处理.babelrc路径
  },
  'webpack.config.js': {
    'ori': 'webpack.config.js',
    'dest': 'webpack.extend.config.js'
  }
}

const main = async () => {

  // 如何开发者配置了自定义文件，则复制使用自定义配置
  // todo: 会覆盖原有配置
  Object.keys(customConfigFiles).forEach(configFile => {
    const cusf = `${customConfigFolerPath}/${customConfigFiles[configFile].ori}`
    if (fs.existsSync(cusf)) {
      const content = fs.readFileSync(cusf, 'utf8')
      const { ori, dest } = customConfigFiles[configFile]
      fs.writeFileSync(path.join(storybookConfigPath, dest || ori), content, 'utf8')  
    }
  })

  // 如果开发者配置了 tsconfig，则copy配置文件
  if (fs.existsSync(`${cpath}/tsconfig.json`)) {
    const content = fs.readFileSync(`${cpath}/tsconfig.json`, 'utf8')
    fs.writeFileSync(path.join(storybookConfigPath, 'tsconfig.json'), content, 'utf8')  
  }

  // 如果开发者配置了 babelrc，则copy配置文件
  if (fs.existsSync(`${cpath}/.babelrc`)) {
    const content = fs.readFileSync(`${cpath}/.babelrc`, 'utf8')
    fs.writeFileSync(path.join(storybookConfigPath, 'babelrc.json'), content, 'utf8')  
  }

  // 配置 运行环境 需要的 stories 配置问题
  const status = makeStories({ storybookConfigPath, storybookFolderName })

  let cp = spawn('npx',
    [
      'start-storybook',
      '-s', '.',
      '-p', port,
      '-c', path.join(storybookConfigPath)
    ], 
    // tsconfig.json 的配置以及
    // ts-loader 模块获取需要在 dirname
    { 'cwd': cpath }
  )
  cp.stdout.on('data', data => colorlog(data))
  cp.stderr.on('data', err_data => colorlog(err_data))
}

main()
