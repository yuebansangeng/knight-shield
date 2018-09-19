
import path from 'path'
import Generator from 'yeoman-generator'
import ConfigConsumer from '../../../core/config-consumer'
import generateHttpHAREntry from '../../../core/generate-http-har-entry'
import ReadRC from '../../../core/read-rc'
import execa from 'execa'

export default class extends Generator {

  async writing () {
    let { contextRoot, port = '9001', independent } = this.options
    const storybookConfigPath = path.join(__dirname, '../../../', 'configs')
    const rc = new ReadRC({ contextRoot })

    // independent
    const cmpPaths = independent ? rc.getComponentsPath() : [ contextRoot ]

    generateHttpHAREntry({ 'httpHARPath': rc.get('mock').https, contextRoot })

    const configer = new ConfigConsumer({ contextRoot, 'name': rc.get('name') })
    configer.generateStoriesJs(cmpPaths)

    execa('npx',
      [
        'start-storybook',
        '-s', '.',
        '-p', port,
        '-c', configer.getConfigPath()
      ],
      {
        'stdio': 'inherit'
      }
    )
  }
}
