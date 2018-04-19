
const ejs = require('ejs')
const path = require('path')
const fs = require('fs')

ejs.renderFile(
  path.join(__dirname, 'stories.ejs'),
  {
    'demos': [{
      'name': 'default'
    }, {
      'name': 'popupform'
    }]
  },
  {}, // ejs options
  (err, str) => {
    if (err) throw err

    fs.writeFile(path.join(__dirname, 'stories.js'), str, (err) => {
      if (err) throw err

      console.log('the entry file is saved!')
    })
  }
)
