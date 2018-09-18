
import os from 'os'
import path from 'path'
import output from '@lerna/output'
import Package from '@lerna/package'
import PackageGraph from '@lerna/package-graph'
import readPackage from './read-package'

export default class PkgGraph {

  constructor (props) {
    this.contextRoot = props.contextRoot
    this.paths = props.paths
  }

  getLocalPackages () {
    // get packages
    let packages = this.paths.map(cp => {

      let pack = readPackage(path.join(cp, 'package.json'))
      // warp for serialize etc.
      return new Package(pack, cp, this.contextRoot)
    })

    // get packages graph
    return new PackageGraph(packages, 'allDependencies', true)  
  }

  updatePackages (moduleNames, version) {

    const localPackages = this.getLocalPackages()

    //notice
    this.ouputUpdated(localPackages, moduleNames, version)

    // update package
    // 'localDependencies': file: | link: resolver
    localPackages.forEach(async ({ pkg, localDependencies }) => {

      // update version for publish
      pkg.version = version

      // update deps' version
      for (const [ resolved ] of localDependencies) {
        pkg.updateLocalDependency(resolved, version, '')
      }

      // override pakcage.json
      await pkg.serialize()
    })
  }

  ouputUpdated (localPackages, moduleNames, version) {
    // no modules no output
    if (!moduleNames) return

    const changes = []

    localPackages.forEach(({ pkg }) => {
      if (!moduleNames.includes(pkg.name)) return
      let line = ` - ${pkg.name}: ${pkg.version} => ${version}`
      changes.push(line)
    })

    output('')
    output('Changes:')
    output(changes.join(os.EOL))
    output('')
  }
}
