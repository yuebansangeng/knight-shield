
import path from 'path'
import { spawn, execSync } from 'child_process'
import makeStories from '../../../helpers/make-stories'
import readrc from '../../../helpers/read-rc'
import fg from 'fast-glob'
import execa from 'execa'

export default async (o) => {
  const {
    contextRoot,
    components = [ contextRoot ],
    output,
    onlyUpdated
  } = o

  const { 'name': module, version } = require(`${contextRoot}/package.json`)
  const storybookConfigPath = path.join(__dirname, '../../../', 'configs')
  const rc = readrc(contextRoot)

  // only build updated module
  if (onlyUpdated) {
    let stdout = execSync(`npm view ${module} versions`)
    if (`${stdout}`.match(new RegExp(`'${version}'`, 'ig'))) {
      return false
    }
  }

  makeStories({ storybookConfigPath, components })

  return await execa('node',
    [
      'node_modules/.bin/build-storybook',
      '-c', storybookConfigPath,
      '-o', `${output || contextRoot}/storybook-static/${rc.name}/${version}`
    ],
    { }
  )
}
