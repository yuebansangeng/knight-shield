
import path from 'path'
import fg from 'fast-glob'

export default o => {
  let { rc, contextRoot, independent, } = o

  let cmpPaths = [ contextRoot ]
    
  // 如果是 independent 模式，则使用 rc 文件中配置的 components
  if (independent) {
    if (rc.components && rc.components.length) {
      cmpPaths = fg.sync(rc.components, { 'onlyDirectories': true }).map(p => path.join(contextRoot, p))
    }
  }

  return cmpPaths
}
