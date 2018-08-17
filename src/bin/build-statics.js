
import path from 'path'
import Promise from 'bluebird'
import { spawn } from 'child_process'
import minimist from 'minimist'
import makeStories from '../make-stories'
import generateHttpHAREntry from '../generate-http-har-entry'
import readrc from '@beisen/read-rc'
import dotenv from 'dotenv'

dotenv.config({ 'path': path.join(__dirname, '..', '..', '.env') })

// 统一添加前缀组件模块前缀
const main = async () => {
  const argv = minimist(process.argv.slice(2))

  // 开发者可以自定义构建静路径
  let cpath = process.cwd()
  if (argv['source-path']) {
    cpath = path.join(process.cwd(), argv['source-path'])
  }

  const { 'name': module, version } = require(`${cpath}/package.json`)

  // 获取rc配置文件中的配置
  let rc = readrc()
  // 组件名称
  const cname = rc.name || module

  // 生成 stories.js 配置文件
  makeStories({ cpath })
  console.log(`配置文件( stories.js )生成完毕`)

  // 生成 https HAR 配置文件
  generateHttpHAREntry({
    // argv['http-har-path']:
    // 该构建任务是jenkins调用，无法在执行指令时配置参数，只能在rc文件中获取
    'httpHARPath': rc.mock.https,
    cpath
  })
  console.log(`配置文件( https.json )生成完毕`)
  console.log(`开始编译静态资源：${cname}/${version}`)

  // 构建
  let { code, message } = await new Promise((resolve, reject) => {
    let resmsg = []
    let build_cp = spawn('node',
      [
        'node_modules/.bin/build-storybook',
        '-c', path.join(__dirname, '..', '.storybook'),
        '-o', `${cpath}/storybook-static/${cname}/${version}`
      ], 
      { }
    )
    build_cp.stdout.on('data', data => resmsg.push(`${data}`))
    build_cp.stderr.on('data', data => resmsg.push(`${data}`))
    build_cp.on('close', code => {
      // 如果不join的方式输出log，会在输出信息换行时出现问题
      resolve({ code, 'message': resmsg.join('') })
    })
  })

  if (code !== 0) {
    throw new Error(message)
  } else {
    console.log(message)
  }
}

main()
