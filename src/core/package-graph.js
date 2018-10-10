
import os from 'os'
import fs from 'fs'
import path from 'path'
import output from '@lerna/output'
import Package from '@lerna/package'
import PackageGraph from '@lerna/package-graph'
import collectUpdates from '@lerna/collect-updates'

const readPackage = (pckPath) => fs.existsSync(pckPath) ? require(pckPath) : {};

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

  updatePackages(version) {
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
    const updatesPackages = collectUpdates(
      this.graph.rawPackageList,
      this.graph,
      // @lerna/collect-updates/lib/make-diff-predicate.js need 'cwd'
      { 'cwd': this.contextRoot },
      { 'ignoreChanges': [] }
    )
    //notice
    this.ouputUpdated(updatesPackages)
    return updatesPackages
  }

  ouputUpdated(updatesPackages) {
    // no modules no output
    const changes = []
    updatesPackages.forEach(({ name, version }) => {
      let line = ` - ${name}: version => ${version}`
      changes.push(line)
    })
    output('')
    output('Changes:')
    output(changes.join(os.EOL))
    output('')
  }
}
