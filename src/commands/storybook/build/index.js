
import path from 'path'
import Generator from 'yeoman-generator'
import buildCmpStatics from './build-cmp-statics'
import overrideConfig from '../../../helpers/override-config'
import generateHttpHAREntry from '../../../helpers/generate-http-har-entry'
import prepareCmpPaths from '../../../helpers/prepare-cmp-paths'
import collectUpdates from '../../../helpers/collect-updates'
import logger from '../../../helpers/logger'

export default class extends Generator {

  async writing () {
    let { rc, contextRoot, independent, output = contextRoot, onlyUpdated } = this.options

    overrideConfig({
      contextRoot,
      'storybookConfigPath': path.join(__dirname, '../../../', 'configs')
    })

    logger.enableProgress()
    let tracker = null

    let cmpPaths = prepareCmpPaths({ contextRoot, independent, rc })

    // 过滤没有修改的组件
    if (onlyUpdated) {
      cmpPaths = await collectUpdates({ contextRoot, independent, rc })
    }

    generateHttpHAREntry({ 'httpHARPath': rc.mock.https, contextRoot })

    tracker = logger.newItem('building', cmpPaths.length)

    for (let i = 0; i < cmpPaths.length; i++) {

      logger.silly('building', cmpPaths[i])
      tracker.completeWork(1)

      await buildCmpStatics({ 'contextRoot': cmpPaths[i], output })
    }

    tracker.finish()
  }
}
