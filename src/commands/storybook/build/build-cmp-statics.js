
import path from 'path'
import ReadRC from '../../../helpers/read-rc'
import execa from 'execa'

export default async (o) => {
  const { contextRoot, output, configer } = o
  const { 'name': module, version } = require(`${contextRoot}/package.json`)
  const rc = new ReadRC({ contextRoot })

  // generate stories.js
  configer.generateStoriesJs([ contextRoot ])

  return execa('npx',
    [
      `build-storybook`,
      '-c', configer.getConfigPath(),
      '-o', `${output || contextRoot}/storybook-static/${rc.get('name')}/${version}`
    ],
    { }
  )
}
