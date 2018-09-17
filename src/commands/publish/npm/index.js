
import path from 'path'
import fg from 'fast-glob'
import Package from '@lerna/package'
import Generator from 'yeoman-generator'
import readrc from '../../../helpers/read-rc'
import PackageGraph from '@lerna/package-graph'
import readPackage from '../../../helpers/read-package'
import collectUpdates from '../../../helpers/collect-updates'
import makePackagesGraph from './make-packages-graph'

export default class extends Generator {
  async writing () {
    const { rc, contextRoot, onlyUpdated } = this.options
    const packinfo = this.options.package

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

    // update package
    // 'localDependencies': file: | link: resolver
    packages.forEach(async ({ pkg, localDependencies }) => {

      // update version for publish
      pkg.version = updateVersion

      // update deps' version
      for (const [ depName, resolved ] of localDependencies) {
        pkg.updateLocalDependency(resolved, updateVersion, '')
      }

      await pkg.serialize().then(() => {
        console.log(`${pkg.name} updated!`)
      })
    })

  }
}
