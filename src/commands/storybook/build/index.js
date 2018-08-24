
import path from 'path'
import fg from 'fast-glob'
import Generator from 'yeoman-generator'
import buildCmpStatics from './build-cmp-statics'
import overrideConfig from '../../../helpers/override-config'
import generateHttpHAREntry from '../../../helpers/generate-http-har-entry'
import logger from '../../../helpers/logger'

export default class extends Generator {

  async writing () {
    let {
      rc,
      contextRoot,
      independent,
      onlyUpdated,
      output = contextRoot
    } = this.options

    overrideConfig({
      contextRoot,
      'storybookConfigPath': path.join(__dirname, '../../../', 'configs')
    })

    logger.enableProgress()
    let tracker = null

    let components = [ contextRoot ]
    if (rc.components.length) {
      components = await fg(rc.components, { 'onlyDirectories': true }).then(cps => 
        cps.map(p => path.join(contextRoot, p))
      )  
    }

    generateHttpHAREntry({ 'httpHARPath': rc.mock.https, contextRoot })
  
    if (independent) {

      tracker = logger.newItem('building', components.length)

      for (let i = 0; i < components.length; i++) {
        logger.silly('building', components[i])
        tracker.completeWork(1)
        await buildCmpStatics({ 'contextRoot': components[i], output, onlyUpdated })
      }

    } else {

      tracker = logger.newItem('building', 1)

      logger.silly('building', contextRoot)
      tracker.completeWork(1)

      await buildCmpStatics({ contextRoot, components, onlyUpdated })
    }

    tracker.finish()
  }
}
