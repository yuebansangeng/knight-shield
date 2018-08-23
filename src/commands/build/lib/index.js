
import fs from 'fs'
import path from 'path'
import fg from 'fast-glob'
import { spawn } from 'child_process'
import Generator from 'yeoman-generator'
import makeSingleLib from './make-single-lib'
import logger from '../../../helpers/logger'

export default class extends Generator {

  async writing () {
    let { contextRoot, workspaces, rc, resp = null } = this.options

    workspaces = workspaces || rc.components || []

    if (workspaces.length) {

      let packages = await fg.sync(workspaces, { 'onlyDirectories': true })
      packages = packages.map(p => path.join(contextRoot, p))

      logger.enableProgress()
      let tracker = logger.newItem('building', packages.length)

      for (let i = 0; i < packages.length; i++) {
        logger.silly('success', packages[i])
        tracker.completeWork(1)
        resp = await makeSingleLib({ 'contextRoot': packages[i] })
      }

      tracker.finish()

    } else {

      resp = await makeSingleLib({ contextRoot })
      logger.info('success', contextRoot)
    }
  }
}
