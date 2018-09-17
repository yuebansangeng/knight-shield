
import path from 'path'
import fg from 'fast-glob'

export default o => {
  let { rc, contextRoot, independent, } = o

  let cmpPaths = [ contextRoot ]
    
  if (independent) {
    if (rc.components && rc.components.length) {
      cmpPaths = fg.sync(rc.components, { 'onlyDirectories': true }).map(p => path.join(contextRoot, p))
    }
  }

  return cmpPaths
}
