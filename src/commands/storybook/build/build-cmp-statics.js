
import path from 'path'
import makeStories from '../../../helpers/make-stories'
import ReadRC from '../../../helpers/read-rc'
import execa from 'execa'

export default async (o) => {
  const { contextRoot, output } = o
  const { 'name': module, version } = require(`${contextRoot}/package.json`)
  const storybookConfigPath = path.join(__dirname, '../../../', 'configs')
  const rc = new ReadRC({ contextRoot })

  makeStories({ storybookConfigPath, 'cmpPaths': [ contextRoot ] })

  return await execa('npx',
    [
      `build-storybook`,
      '-c', storybookConfigPath,
      '-o', `${output || contextRoot}/storybook-static/${rc.get('name')}/${version}`
    ],
    { }
  )
}
