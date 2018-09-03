
import path from 'path'
import execa from 'execa'
import fg from 'fast-glob'

// 通过 git diff 获取当前与上一次提交中的变动文件，然后筛选出更新的组件
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
          if (cfs.match(new RegExp(cmpPaths[i], 'ig')))
            res.push(path.join(contextRoot, cmpPaths[i]))
        }
        return res
      })
  } else {
    
    return cmpPaths
  }
}
