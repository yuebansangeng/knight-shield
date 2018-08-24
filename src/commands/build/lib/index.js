
import fs from 'fs'
import path from 'path'
import fg from 'fast-glob'
import { fork } from 'child_process'
import Generator from 'yeoman-generator'
import makeSingleLib from './make-single-lib'
import logger from '../../../helpers/logger'

export default class extends Generator {

  async writing () {
    let { contextRoot, watch, rc, resp = null } = this.options
    let { components, workspaces } = rc

    logger.enableProgress()
    let tracker = null

    // default workspaces
    if (!workspaces.length) {
      workspaces = workspaces.concat(components)
    }

    if (workspaces.length) {

      let packages = fg.sync(workspaces, { 'onlyDirectories': true })
      packages = packages.map(p => path.join(contextRoot, p))
      
      tracker = logger.newItem('building', packages.length)

      for (let i = 0; i < packages.length; i++) {

        logger.silly('success', packages[i])
        tracker.completeWork(1)
        await makeSingleLib({ 'contextRoot': packages[i] })
      }

    } else {

      tracker = logger.newItem('building', 1)

      logger.silly('success', contextRoot)
      tracker.completeWork(1)

      await makeSingleLib({ contextRoot })
    }

    tracker.finish()
    logger.disableProgress()

    // watching change, rebuild
    if (watch) {
      logger.info('watching', '*/src')
      fork(`${__dirname}/watcher.js`, [ '--workspaces', JSON.stringify(workspaces), '--context-root', contextRoot ])
    }
  }
}
