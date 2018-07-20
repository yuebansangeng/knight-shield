
import path from 'path'
import Promise from 'bluebird'
import { spawn } from 'child_process'
import Hjson from 'hjson'
import makeStories from './make-stories'
import fs from 'fs'
import readRC from '@beisen/read-rc'
import dotenv from 'dotenv'

dotenv.config({ 'path': path.join(__dirname, '..', '.env') })

// 统一添加前缀组件模块前缀
const main = async () => {
  const cpath = process.cwd()
  const { RC_FILENAME } = process.env
  const { 'name': module, version } = require(`${cpath}/package.json`)

  // 获取rc配置文件中的配置
  let rc = readRC()
  // 组件名称
  const cname = rc.name || module

  console.log(`${cname}/${version} 编译中...`)

  // 生成 stories.js 配置文件
  await new Promise(async (resolve, reject) => {
    // 生成配置文件
    await makeStories()
    // 构建
    let { code, message } = await new Promise((resolve, reject) => {
      let resmsg = []
      let build_cp = spawn('node',
        [
          'node_modules/.bin/build-storybook',
          '-c', `${__dirname}/.storybook`,
          '-o', `${cpath}/storybook-static/${cname}/${version}`
        ], 
        {
          'cwd': cpath
        }
      )
      build_cp.stdout.on('data', data => resmsg.push(`${data}`))
      build_cp.stderr.on('data', data => resmsg.push(`${data}`))
      build_cp.on('close', code => {
        // 如果不join的方式输出log，会在输出信息换行时出现问题
        resolve({ code, 'message': resmsg.join('') })
      })
    })

    if (code !== 0 ) {
      throw new Error(message)
    } else {
      console.log(message)
    }
  })
}

main()
