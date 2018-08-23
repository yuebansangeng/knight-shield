
import path from 'path'
import fg from 'fast-glob'
import Generator from 'yeoman-generator'
import buildCmpStatics from './build-cmp-statics'
import overrideConfig from '../../../helpers/override-config'

export default class extends Generator {

  async writing () {
    let { contextRoot, independent, rc, output = contextRoot, logger } = this.options

    // 用开发者自定义配置文件，覆盖默认文件
    overrideConfig({
      contextRoot,
      'storybookConfigPath': path.join(__dirname, '../../../', 'configs')
    })
  
    if (independent) {
  
      let components = await fg.sync(rc.components, { 'onlyDirectories': true })
      components = components.map(cmp => path.join(contextRoot, cmp))

      logger.enableProgress()
      let tracker = logger.newItem('building', components.length)
  
      for (let i = 0; i < components.length; i++) {
        logger.silly('success', components[i])
        tracker.completeWork(1)
        await buildCmpStatics({ 'contextRoot': components[i], output })
      }

      tracker.finish()
  
    } else {

      await buildCmpStatics({ contextRoot })
      logger.info('success', contextRoot)
    }
  }
}
