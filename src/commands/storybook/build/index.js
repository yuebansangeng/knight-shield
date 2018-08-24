
import path from 'path'
import fg from 'fast-glob'
import Generator from 'yeoman-generator'
import buildCmpStatics from './build-cmp-statics'
import overrideConfig from '../../../helpers/override-config'
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

    // 用开发者自定义配置文件，覆盖默认文件
    overrideConfig({
      contextRoot,
      'storybookConfigPath': path.join(__dirname, '../../../', 'configs')
    })

    logger.enableProgress()
    let tracker = null

    // 获取相关组件集合的配置
    let components = [ contextRoot ]
    if (rc.components.length) {
      components = await fg(rc.components, { 'onlyDirectories': true }).then(cps => 
        cps.map(p => path.join(contextRoot, p))
      )  
    }
  
    // 在组件集合中的所有的组件，都单独进行构建
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
