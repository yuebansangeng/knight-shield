
import path from 'path'
import fg from 'fast-glob'
import readrc from '../../../helpers/read-rc'
import readPackage from '../../../helpers/read-package'
import PackageGraph from '@lerna/package-graph'

export default async o => {
  let { contextRoot, onlyUpdated, independent } = o
  let rc = readrc(contextRoot)

  let cmpPaths = fg.sync(rc.components, { 'onlyDirectories': true })

  if (onlyUpdated) {
    // 'independent': true => get all components package
    cmpPaths = await collectUpdates({ contextRoot, independent, rc })
  }

  let packages = cmpPaths.map(cp => readPackage(path.join(contextRoot, cp, 'package.json')))
 
  return new PackageGraph(packages)
}
