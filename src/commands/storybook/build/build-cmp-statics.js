
import execa from 'execa'
import ReadRC from '../../../core/read-rc'
import ConfigConsumer from '../../../core/config-consumer'

export default async (o) => {
  const { contextRoot, output } = o
  const { version } = require(`${contextRoot}/package.json`)
  const rc = new ReadRC({ contextRoot })

  // generate configs
  const configer = new ConfigConsumer({ contextRoot, 'name': rc.get('name') })
  configer.generateStoriesJs([ contextRoot ])
  configer.generateHttpHAREntry(rc.get('mock').https)

  return execa('npx',
    [
      `build-storybook`,
      '-c', configer.getConfigPath(),
      '-o', `${output || contextRoot}/storybook-static/${rc.get('name')}/${version}`
    ],
    { }
  )
}
