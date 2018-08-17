
import { spawn } from 'child_process'
import path from 'path'
import fs from 'fs'
import minimist from 'minimist'
import colorlog from '../color-log'
import makeStories from '../make-stories'
import overrideConfig from '../override-config'
import generateHttpHAREntry from '../generate-http-har-entry'
import dotenv from 'dotenv'
import readrc from '@beisen/read-rc'
import 'colors'

dotenv.config({ 'path': path.join(__dirname, '..', '..', '.env') })

// 配置需要的参数，需要改动维护的几率比较高
const cpath = process.cwd() // cpath 组件调用命令传入的路径
const argv = minimist(process.argv.slice(2)) // 格式化传入参数 --port 5000 => { port: 5000 }
const storybookConfigPath = path.join(__dirname, '..', '.storybook')
const port = argv.port || '9001'

const main = async () => {

  // 用开发者自定义配置文件，覆盖默认文件
  overrideConfig({
    'configPath': `${cpath}/.storybook`,
    'configs': [
      'manager-head.html',
      'preview-head.html',
      'addons.js',
      'config.js',
      {
        'ori': 'webpack.config.js',
        'dest': 'webpack.extend.config.js'
      }
    ]
  })

  overrideConfig({
    'configPath': cpath,
    'configs': [
      'tsconfig.json',
      {
        'ori': '.babelrc',
        'dest': 'babelrc.json' // 转换成json文件，不需要处理.babelrc路径
      }
    ]
  })

  // 配置 运行环境 需要的 stories 配置问题
  const status = makeStories({ storybookConfigPath })

  // 生成 https HAR 配置文件
  // 同时支持 "参数" 和 "配置" 方式
  generateHttpHAREntry({
    'httpHARPath': argv['http-har-path'] || readrc().mock.https,
    cpath
  })

  // 启动本地调试环境
  let cp_sytb = spawn('node',
    [
      'node_modules/.bin/start-storybook',
      '-s', '.',
      '-p', port,
      '-c', path.join(storybookConfigPath)
    ],
    { }
  )
  cp_sytb.stdout.on('data', data => colorlog(data))
  cp_sytb.stderr.on('data', err_data => colorlog(err_data))
}

main()
