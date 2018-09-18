
import os from 'os'
import output from '@lerna/output'
import ReadRC from '../../../helpers/read-rc'

export default o => {
  const { packages, version, contextRoot } = o
  const rc = new ReadRC({ contextRoot })

  // default version is package
  let updateVersion = rc.get('version') || version

  //notice
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
}

// from lerna source
// output message for updates
const ouputUpdated = o => {
  let { packages, updateVersion } = o

  const changes = []
  packages.forEach(({ pkg }) => {
    let line = ` - ${pkg.name}: ${pkg.version} => ${updateVersion}`
    changes.push(line)
  })

  output('')
  output('Changes:')
  output(changes.join(os.EOL))
  output('')
}
