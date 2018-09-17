
import os from 'os'
import path from 'path'
import fg from 'fast-glob'
import output from '@lerna/output'
import Package from '@lerna/package'
import readrc from '../../../helpers/read-rc'
import PackageGraph from '@lerna/package-graph'
import readPackage from '../../../helpers/read-package'

export default o => {
  const { rc, contextRoot } = o
  const packinfo = o.package

  // components is sub of workspaces
  // there mabe some another module which is not component，but independent npm module
  let cmpPaths = fg.sync(rc.workspaces || rc.components, { 'onlyDirectories': true })

  // TODO: 
  // if (onlyUpdated) {
  // 'independent': true => get all components package
  // cmpPaths = await collectUpdates({ contextRoot, 'independent': true, rc })
  // }

  // default version is package
  let updateVersion = readrc(contextRoot).version || packinfo.version

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

    await pkg.serialize()
  })
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
