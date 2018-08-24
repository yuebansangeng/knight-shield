
import path from 'path'
import fs from 'fs'

export default (o) => {
  let {
    httpHARPath,
    destinationPath = path.join(__dirname, 'http-mock', 'https.json'),
    contextRoot
  } = o

  if (!httpHARPath) {
    return false
  }

  if (httpHARPath) {
    httpHARPath = path.join(contextRoot, httpHARPath)
  } else {
    httpHARPath = contextRoot
  }

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
