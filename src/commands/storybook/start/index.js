
import path from 'path'
import Generator from 'yeoman-generator'
import makeStories from '../../../helpers/make-stories'
import overrideConfig from '../../../helpers/override-config'
import generateHttpHAREntry from '../../../helpers/generate-http-har-entry'
import ReadRC from '../../../helpers/read-rc'
import execa from 'execa'

export default class extends Generator {

  async writing () {
    let { contextRoot, port = '9001', independent } = this.options
    const storybookConfigPath = path.join(__dirname, '../../../', 'configs')
    const rc = new ReadRC({ contextRoot })

    overrideConfig({ contextRoot, storybookConfigPath })

    // independent
    let cmpPaths = independent ? rc.getComponentsPath() : [ contextRoot ]

    makeStories({ storybookConfigPath, cmpPaths })

    generateHttpHAREntry({ 'httpHARPath': rc.get('mock').https, contextRoot })

    execa('npx',
      [
        'start-storybook',
        '-s', '.',
        '-p', port,
        '-c', storybookConfigPath
      ],
      {
        'stdio': 'inherit'
      }
    )
  }
}
