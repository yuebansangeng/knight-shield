
import fs from 'fs'
import path from 'path'

// o.configs
// const configs = [
//   'tsconfig.json',
//   {
//     'ori': '.babelrc',
//     'dest': 'babelrc.json' // 转换成json文件，不需要处理.babelrc路径
//   }
// ]

export default (o) => {
  const { configPath, destinationPath, configs = [] } = o

  // 开发者自定的配置文件
  let retFilesPath = []

  // 循环配置文件，覆盖开发者传入的自定义配置
  configs.forEach(config => {

    const { ori = config, dest } = config
    const configFilePath = `${configPath}/${ori}`

    if (fs.existsSync(configFilePath)) {

      // 复制配置文件到目标路径下
      fs.writeFileSync(
        path.join(destinationPath, dest || ori),
        fs.readFileSync(configFilePath, 'utf8'),
        'utf8'
      )

      // 记录自定义配置文件
      retFilesPath.push(configFilePath)
    }
  })

  return retFilesPath
}
