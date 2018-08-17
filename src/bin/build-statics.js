
import path from 'path'
import minimist from 'minimist'
import dotenv from 'dotenv'
import fg from 'fast-glob'
import buildCmpStatics from '../build-cmp-statics'
import readrc from '@beisen/read-rc'

dotenv.config({ 'path': path.join(__dirname, '..', '..', '.env') })

// 统一添加前缀组件模块前缀
const main = async (o) => {
  const {
    independent,
    'source-path': sourcePath
  } = minimist(process.argv.slice(2))

  // 开发者可以自定义构建静路径
  let cpath = process.cwd()
  if (sourcePath) {
    cpath = path.join(process.cwd(), sourcePath)
  }

  let rc = readrc(cpath)

  let resp = null

  if (independent) {

    let components = await fg.sync(rc.components, { 'onlyDirectories': true })
    components = components.map(cmp => path.join(cpath, cmp))

    for (let i = 0; i < components.length; i++) {
      resp = await buildCmpStatics({
        'cpath': components[i],
        'staticOutputPath': cpath
      })

      if (resp.code !== 0) {
        throw new Error(resp.message)
      } else {
        console.log(resp.message)
      }
    }

  } else {

    resp = await buildCmpStatics({ cpath })

    if (resp.code !== 0) {
      throw new Error(resp.message)
    } else {
      console.log(resp.message)
    }
  }
}

main()
