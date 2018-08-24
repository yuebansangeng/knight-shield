
import path from 'path'
import Generator from 'yeoman-generator'
import { spawn } from 'child_process'
import makeStories from '../../../helpers/make-stories'
import overrideConfig from '../../../helpers/override-config'
import generateHttpHAREntry from '../../../helpers/generate-http-har-entry'
import fg from 'fast-glob'
import execa from 'execa'

export default class extends Generator {

  async writing () {
    let { contextRoot, rc, port = '9001' } = this.options
    const storybookConfigPath = path.join(__dirname, '../../../', 'configs')

    overrideConfig({ contextRoot, storybookConfigPath })

    let components = [ contextRoot ]
    if (rc.components.length) {
      components = await fg(rc.components, { 'onlyDirectories': true }).then(cps => 
        cps.map(p => path.join(contextRoot, p))
      )
    }
    makeStories({ storybookConfigPath, components })

    generateHttpHAREntry({ 'httpHARPath': rc.mock.https, contextRoot })

    execa('node',
      [
        'node_modules/.bin/start-storybook',
        '-s', '.',
        '-p', port,
        '-c', storybookConfigPath
      ],
      { 'stdio': 'inherit' }
    )
  }
}
