
import os from 'os'
import path from 'path'
import output from '@lerna/output'
import Package from '@lerna/package'
import PackageGraph from '@lerna/package-graph'
import readPackage from '../helpers/read-package'
import collectUpdates from '@lerna/collect-updates'

export default class PkgGraph {

  constructor(props) {
    this.contextRoot = props.contextRoot
    this.paths = props.paths
    this.graph = this.makePackageGraph()
    this.packages = this.graph.rawPackageList
  }

  makePackageGraph() {
    const packages = this.paths.map(cp => {
      let pack = readPackage(path.join(cp, 'package.json'))
      // warp for serialize etc.
      return new Package(pack, cp, this.contextRoot)
    })
    // get graph
    return new PackageGraph(packages, 'allDependencies', true)
  }

  updatePackages(moduleNames, version) {
    //notice
    this.ouputUpdated(moduleNames, version)
    // update package
    // 'localDependencies': file: | link: resolver
    this.graph.forEach(async ({ pkg, localDependencies }) => {
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

  collectUpdates() {
    // rawPackageList like results
    return collectUpdates(
      this.graph.rawPackageList,
      this.graph,
      // @lerna/collect-updates/lib/make-diff-predicate.js need 'cwd'
      { 'cwd': this.contextRoot },
      {}
    )
  }

  ouputUpdated(moduleNames, version) {
    // no modules no output
    if (!moduleNames) return
    const changes = []

    this.graph.forEach(({ pkg }) => {
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
