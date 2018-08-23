
import path from 'path'
import fg from 'fast-glob'
import Generator from 'yeoman-generator'
import buildCmpStatics from './build-cmp-statics'
import overrideConfig from '../../../helpers/override-config'
import logger from '../../../helpers/logger'

export default class extends Generator {

  async writing () {
    let { contextRoot, independent, rc, output = contextRoot } = this.options

    // 用开发者自定义配置文件，覆盖默认文件
    overrideConfig({
      contextRoot,
      'storybookConfigPath': path.join(__dirname, '../../../', 'configs')
    })

    logger.enableProgress()
    let tracker = null
  
    if (independent && rc.components && rc.components.length) {
  
      let components = await fg.sync(rc.components, { 'onlyDirectories': true })
      components = components.map(cmp => path.join(contextRoot, cmp))

      tracker = logger.newItem('building', components.length)

      for (let i = 0; i < components.length; i++) {
        logger.silly('building', components[i])
        tracker.completeWork(1)
        await buildCmpStatics({ 'contextRoot': components[i], output })
      }

    } else {

      tracker = logger.newItem('building', 1)

      logger.silly('building', contextRoot)
      tracker.completeWork(1)

      await buildCmpStatics({ contextRoot })
    }

    tracker.finish()
  }
}
