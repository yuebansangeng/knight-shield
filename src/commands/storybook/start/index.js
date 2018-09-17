
import path from 'path'
import Generator from 'yeoman-generator'
import makeStories from '../../../helpers/make-stories'
import overrideConfig from '../../../helpers/override-config'
import generateHttpHAREntry from '../../../helpers/generate-http-har-entry'
import prepareCmpPaths from '../../../helpers/prepare-cmp-paths'
import execa from 'execa'

export default class extends Generator {

  async writing () {
    let { contextRoot, rc, port = '9001', independent } = this.options
    const storybookConfigPath = path.join(__dirname, '../../../', 'configs')

    overrideConfig({ contextRoot, storybookConfigPath })

    let cmpPaths = prepareCmpPaths({ contextRoot, independent, rc })

    makeStories({ storybookConfigPath, cmpPaths })

    generateHttpHAREntry({ 'httpHARPath': rc.mock.https, contextRoot })

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
