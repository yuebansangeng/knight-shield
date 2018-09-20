
import fs from 'fs'

const copydir = (srcDir, dstDir) => {
  var results = []
  var list = fs.readdirSync(srcDir)
  var src, dst

  list.forEach(file => {
    src = srcDir + '/' + file
    dst = dstDir + '/' + file
    var stat = fs.statSync(src)
    if (stat && stat.isDirectory()) {
      try {
        fs.mkdirSync(dst)
      } catch (e) {
        console.log('directory already exists: ' + dst)
      }
      results = results.concat(copydir(src, dst))
    } else {
      try {
        fs.writeFileSync(dst, fs.readFileSync(src))
      } catch (e) {
        console.log('could\'t copy file: ' + dst)
      }
      results.push(src)
    }
  })
  return results
}

export default copydir
