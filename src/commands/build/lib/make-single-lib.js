
import path from 'path'
import execa from 'execa'

export default (o) => {
  const { contextRoot } = o
  const storybookConfigPath = path.join(__dirname, '..', '..', '..', 'configs')

  return execa('npx', [
      'gulp',
      '--gulpfile', path.join(__dirname, '..', '..', '..', 'configs', 'gulpfile.js'),
      '--cwd', contextRoot,
      '--colors'
    ],
    { 'encoding': 'utf8' }
  )
}
