
import path from 'path'
import execa from 'execa'
import override from '../../../helpers/override-config/override'

export default async (o) => {
  const { contextRoot } = o
  const storybookConfigPath = path.join(__dirname, '..', '..', '..', 'configs')

  // custom configs override
  override({
    'configPath': contextRoot,
    'destinationPath': storybookConfigPath,
    'configs': [
      'gulpfile.js',
      'tsconfig.json'
    ]
  })

  // TODO: Promise.map 10
  return await execa('npx', [
      'gulp',
      '--gulpfile', path.join(__dirname, '..', '..', '..', 'configs', 'gulpfile.js'),
      '--cwd', contextRoot,
      '--colors'
    ],
    { 'encoding': 'utf8' }
  )
}
