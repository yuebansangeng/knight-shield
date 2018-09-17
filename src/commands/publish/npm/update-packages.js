
import os from 'os'
import path from 'path'
import output from '@lerna/output'
import Package from '@lerna/package'
import PackageGraph from '@lerna/package-graph'
import readrc from '../../../helpers/read-rc'
import readPackage from '../../../helpers/read-package'

export default o => {
  const { rc, contextRoot, cmpPaths, 'package': { version } } = o

  // default version is package
  let updateVersion = readrc(contextRoot).version || version

  // get packages
  let packages = cmpPaths.map(cp => {

    let pack = readPackage(path.join(contextRoot, cp, 'package.json'))
    // warp for serialize etc.
    return new Package(pack, cp, contextRoot)
  })

  // get packages graph
  packages = new PackageGraph(packages, 'allDependencies', true)

  ouputUpdated({ packages, updateVersion })

  // update package
  // 'localDependencies': file: | link: resolver
  packages.forEach(async ({ pkg, localDependencies }) => {

    // update version for publish
    pkg.version = updateVersion

    // update deps' version
    for (const [resolved] of localDependencies) {
      pkg.updateLocalDependency(resolved, updateVersion, '')
    }

    // override pakcage.json
    await pkg.serialize()
  })

  return { packages, updateVersion }
}

// output message for updates
const ouputUpdated = o => {
  let { packages, updateVersion } = o

  const changes = []
  packages.forEach(({ pkg }) => {
    let line = ` - ${pkg.name}: ${pkg.version} => ${updateVersion}`
    // if (pkg.private) {
    //   line += ` (${chalk.red("private")})`
    // }
    changes.push(line)
  })

  output('')
  output('Changes:')
  output(changes.join(os.EOL))
  output('')
}
