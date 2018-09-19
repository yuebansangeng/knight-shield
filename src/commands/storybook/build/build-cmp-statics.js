
import path from 'path'
import execa from 'execa'
import ReadRC from '../../../helpers/read-rc'
import ConfigConsumer from '../../../helpers/config-consumer'

export default async (o) => {
  const { contextRoot, output } = o
  const { 'name': module, version } = require(`${contextRoot}/package.json`)
  const rc = new ReadRC({ contextRoot })

  // generate configs
  const configer = new ConfigConsumer({ contextRoot, 'name': rc.get('name') })
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
