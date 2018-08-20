
import path from 'path'
import fs from 'fs'

export default (o) => {
  let {
    httpHARPath,
    destinationPath = path.join(__dirname, 'http-mock', 'https.json'),
    contextRoot
  } = o

  // 未传入 har 所在目录，直接跳出
  if (!httpHARPath) {
    return false
  }

  // 根据外部传入的 http hars 相对路径，生成绝对路径
  if (httpHARPath) {
    httpHARPath = path.join(contextRoot, httpHARPath)
  } else {
    httpHARPath = contextRoot
  }

  // 为找到指定配置文件所在的文件路径
  if (!fs.existsSync(httpHARPath)) {
    return false
  }

  let entries = []
  fs.readdirSync(httpHARPath)
    .filter(filename => !filename.match(/^\./))
    .forEach(filename => {
      const harHttpJson = require(path.join(httpHARPath, filename))
      entries.push(harHttpJson)
    })

  fs.writeFileSync(
    destinationPath,
    JSON.stringify({
      'log': {
        'version': '0.0.1',
        'creator': {
          'name': '@beisen/http-mocker',
          'version': '0.0.1'
        },
        'pages': {},
        'entries': entries
      }
    }, null, 2),
    'utf8'
  )
}
