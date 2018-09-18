
import path from 'path'
import Package from '@lerna/package'
import PackageGraph from '@lerna/package-graph'
import readPackage from '../../../helpers/read-package'

export default o => {
  const { contextRoot, cmpPaths } = o

  // get packages
  let packages = cmpPaths.map(cp => {

    let pack = readPackage(path.join(cp, 'package.json'))
    // warp for serialize etc.
    return new Package(pack, cp, contextRoot)
  })

  // get packages graph
  return new PackageGraph(packages, 'allDependencies', true)  
}
