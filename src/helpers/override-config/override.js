
import fs from 'fs'
import path from 'path'

// o.configs
// const configs = [
//   'tsconfig.json',
//   {
//     'ori': '.babelrc',
//     'dest': 'babelrc.json'
//   }
// ]

export default (o) => {
  const { configPath, destinationPath, configs = [] } = o

  let retFilesPath = []

  configs.forEach(config => {

    const { ori = config, dest } = config
    const configFilePath = `${configPath}/${ori}`

    if (fs.existsSync(configFilePath)) {

      fs.writeFileSync(
        path.join(destinationPath, dest || ori),
        fs.readFileSync(configFilePath, 'utf8'),
        'utf8'
      )

      retFilesPath.push(configFilePath)
    }
  })

  return retFilesPath
}
