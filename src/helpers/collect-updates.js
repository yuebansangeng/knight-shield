
import path from 'path'
import execa from 'execa'
import fg from 'fast-glob'

export default async o => {
  let { contextRoot, independent, rc } = o
  let args = [ 'diff', 'HEAD^', 'HEAD', '--name-only' ]

  let cmpPaths = [ contextRoot ]

  if (independent) {
    if (rc.components && rc.components.length) {
      cmpPaths = fg.sync(rc.components, { 'onlyDirectories': true })
    }

    if (cmpPaths && cmpPaths.length) {
      args = args.concat([ '--' ]).concat(cmpPaths)
    }

    return await execa('git', args)
      .then(({ stdout }) => stdout.split('\n'))
      .then(changeFiles => {
        let cfs = changeFiles.join(',') // O(n^2) => O(n)
        let res = []
        for(var i = 0; i < cmpPaths.length; i++) {
          // remove relative path head ./
          let cp = cmpPaths[i].replace(/^\.\//, '')
          if (cfs.match(new RegExp(cp, 'ig')))
            res.push(path.join(contextRoot, cp))
        }
        return res
      })
  } else {
    
    return cmpPaths
  }
}
