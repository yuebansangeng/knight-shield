
import os from 'os'
import output from '@lerna/output'

export default o => {
  const {
    packages,
    rootProjectVersion,
    publishCmpNames
  } = o

  //notice
  ouputUpdated(packages, publishCmpNames, rootProjectVersion)

  // update package
  // 'localDependencies': file: | link: resolver
  packages.forEach(async ({ pkg, localDependencies }) => {

    // update version for publish
    pkg.version = rootProjectVersion

    // update deps' version
    for (const [ resolved ] of localDependencies) {
      pkg.updateLocalDependency(resolved, rootProjectVersion, '')
    }

    // override pakcage.json
    await pkg.serialize()
  })
}

// from lerna source
// output message for updates
const ouputUpdated = (packages, publishCmpNames, updateVersion) => {

  const changes = []
  packages.forEach(({ pkg }) => {
    if (!publishCmpNames.includes(pkg.name)) return
    let line = ` - ${pkg.name}: ${pkg.version} => ${updateVersion}`
    changes.push(line)
  })

  output('')
  output('Changes:')
  output(changes.join(os.EOL))
  output('')
}
