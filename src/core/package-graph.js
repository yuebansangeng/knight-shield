
import os from 'os'
import path from 'path'
import output from '@lerna/output'
import Package from '@lerna/package'
import PackageGraph from '@lerna/package-graph'
import readPackage from '../helpers/read-package'
import collectUpdates from '@lerna/collect-updates'
import fg from 'fast-glob'

export default class PkgGraph {

  constructor(props) {
    this.contextRoot = props.contextRoot
    this.paths = props.paths
    this.packages = this.getPackages()
  }

  getPackages() {
    // get packages
    let packages = this.paths.map(cp => {
      let pack = readPackage(path.join(cp, 'package.json'))
      // warp for serialize etc.
      return new Package(pack, cp, this.contextRoot)
    })
    // get packages graph
    return new PackageGraph(packages, 'allDependencies', true)  
  }

  updatePackages(moduleNames, version) {
    //notice
    this.ouputUpdated(moduleNames, version)
    // update package
    // 'localDependencies': file: | link: resolver
    this.packages.forEach(async ({ pkg, localDependencies }) => {
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

  collectUpdates(filteredPackages) {
    // 
    // let includes = this.packages.map(cp => {
    //   let pack = readPackage(path.join(this.contextRoot, cp, 'package.json'))
    //   return new Package(pack, cp, this.contextRoot).name
    // })
    // let filteredPackages = filterPackages(this.packages.rawPackageList, includes, [], false)
    let updates = collectUpdates(
      filteredPackages.rawPackageList,
      this.packages,
      // @lerna/collect-updates/lib/make-diff-predicate.js need 'cwd'
      { 'cwd': this.contextRoot },
      {}
    )
    return updates.map(node => node.location)
  }

  ouputUpdated(moduleNames, version) {
    // no modules no output
    if (!moduleNames) return
    const changes = []

    this.packages.forEach(({ pkg }) => {
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
