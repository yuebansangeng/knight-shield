
import fs from 'fs'
import path from 'path'
import fg from 'fast-glob'
import { fork } from 'child_process'
import Generator from 'yeoman-generator'
import makeSingleLib from './make-single-lib'
import logger from '../../../helpers/logger'
import prepareCmpPaths from '../../../helpers/prepare-cmp-paths'

export default class extends Generator {

  async writing () {
    let { contextRoot, watch, rc, independent } = this.options
    let { components, workspaces } = rc

    logger.enableProgress()
    let tracker = null

    let buildPaths = [ contextRoot ]

    if (independent) {
      // component paths, default
      buildPaths = prepareCmpPaths({ contextRoot, 'independent': true, rc })
      // override build paths, if workspaces
      if (workspaces && workspaces.length) {
        buildPaths = fg.sync(workspaces, { 'onlyDirectories': true }).map(p => path.join(contextRoot, p))
      }
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
      fork(`${__dirname}/watcher.js`, [ '--workspaces', JSON.stringify(workspaces), '--context-root', contextRoot ])
    }
  }
}
