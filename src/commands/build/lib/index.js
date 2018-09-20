
import Promise from 'bluebird'
import { fork } from 'child_process'
import Generator from 'yeoman-generator'
import makeSingleLib from './make-single-lib'
import logger from '../../../helpers/logger'
import ReadRC from '../../../core/read-rc'
import ConfigConsumer from '../../../core/config-consumer'

export default class extends Generator {
  writing () {
    let { contextRoot, watch, independent } = this.options
    let rc = new ReadRC({ contextRoot })

    logger.enableProgress()
    let tracker = null

    let buildPaths = [ contextRoot ]

    if (independent) {
      // component paths, default
      // override build paths
      buildPaths = rc.getLibsPath()
    }

    // generate configs
    const configer = new ConfigConsumer({ contextRoot, 'name': rc.get('name') })

    tracker = logger.newItem('building', buildPaths.length)

    Promise.map(
      buildPaths,
      subCmpContextRoot => {

        logger.silly('success', subCmpContextRoot)
        tracker.completeWork(1)

        return makeSingleLib({ 'contextRoot': subCmpContextRoot, configer })
      },
      // 6 sub-process one time
      { 'concurrency': 6 }
    ).then(() => {

      tracker.finish()
      logger.disableProgress()

      // watching change, rebuild
      if (watch) {
        logger.info('watching', '*/src')
        fork(`${__dirname}/watcher.js`, [ '--packages', JSON.stringify(buildPaths) ])
      }
    })
  }
}
