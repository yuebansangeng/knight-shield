
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

  return await execa('node', [
      'node_modules/.bin/gulp',
      '--gulpfile', path.join(__dirname, '..', '..', '..', 'configs', 'gulpfile.js'),
      '--cwd', contextRoot,
      '--colors'
    ],
    { 'encoding': 'utf8' }
  )
}
