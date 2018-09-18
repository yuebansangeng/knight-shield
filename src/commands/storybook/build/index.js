
import path from 'path'
import Generator from 'yeoman-generator'
import buildCmpStatics from './build-cmp-statics'
import overrideConfig from '../../../helpers/override-config'
import generateHttpHAREntry from '../../../helpers/generate-http-har-entry'
import prepareCmpPaths from '../../../helpers/prepare-cmp-paths'
import collectUpdates from '../../../helpers/collect-updates'
import logger from '../../../helpers/logger'
import ReadRC from '../../../helpers/read-rc'

export default class extends Generator {

  async writing () {
    const { contextRoot, independent, onlyUpdated } = this.options
    const rc = new ReadRC({ contextRoot })

    overrideConfig({
      contextRoot,
      'storybookConfigPath': path.join(__dirname, '../../../', 'configs')
    })

    logger.enableProgress()
    let tracker = null

    // independent
    let cmpPaths = independent ? rc.getComponentsPath() : [ contextRoot ]

    // onlyUpdated
    if (onlyUpdated) {
      cmpPaths = await collectUpdates({
        contextRoot,
        // 'false': only need relative path, for git diff check
        'cmpPaths': rc.getComponentsPath(false)
      })
    }

    generateHttpHAREntry({ 'httpHARPath': rc.get('mock').https, contextRoot })

    tracker = logger.newItem('building', cmpPaths.length)

    for (let i = 0; i < cmpPaths.length; i++) {

      logger.silly('building', cmpPaths[i])
      tracker.completeWork(1)

      await buildCmpStatics({ 'contextRoot': cmpPaths[i], 'output': contextRoot })
    }

    tracker.finish()
  }
}
