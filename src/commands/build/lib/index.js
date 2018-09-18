
import path from 'path'
import fg from 'fast-glob'
import { fork } from 'child_process'
import Generator from 'yeoman-generator'
import makeSingleLib from './make-single-lib'
import logger from '../../../helpers/logger'
import ReadRC from '../../../helpers/read-rc'

export default class extends Generator {

  async writing () {
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

    tracker = logger.newItem('building', buildPaths.length)

    for (let i = 0; i < buildPaths.length; i++) {

      logger.silly('success', buildPaths[i])
      tracker.completeWork(1)

      await makeSingleLib({ 'contextRoot': buildPaths[i] })
    }

    tracker.finish()
    logger.disableProgress()

    // watching change, rebuild
    if (watch) {
      logger.info('watching', '*/src')
      fork(`${__dirname}/watcher.js`, [ '--packages', JSON.stringify(buildPaths) ])
    }
  }
}
