
import path from 'path'
import minimist from 'minimist'
import dotenv from 'dotenv'
import buildCmpStatics from '../build-cmp-statics'

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

  let resp = null
  if (independent) {

  } else {
    resp = await buildCmpStatics({ cpath })  
  }

  if (resp.code !== 0) {
    throw new Error(resp.message)
  } else {
    console.log(resp.message)
  }
}

main()
