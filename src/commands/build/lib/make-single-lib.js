
import path from 'path'
import execa from 'execa'

export default (o) => {
  const { contextRoot, configer } = o

  return execa('npx', [
      'gulp',
      '--gulpfile', path.join(configer.getConfigPath(), 'gulpfile.js'),
      '--cwd', contextRoot,
      '--colors'
    ],
    { 'encoding': 'utf8' }
  )
}
