
import fs from 'fs'
import path from 'path'
import fg from 'fast-glob'
import { spawn } from 'child_process'
import Generator from 'yeoman-generator'
import makeSingleLib from './make-single-lib'

export default class extends Generator {

  async writing () {
    let { contextRoot, workspaces, rc, resp = null } = this.options

    workspaces = workspaces || rc.components || []

    if (workspaces.length) {

      let packages = await fg.sync(workspaces, { 'onlyDirectories': true })
      packages = packages.map(p => path.join(contextRoot, p))

      for (let i = 0; i < packages.length; i++) {
        resp = await makeSingleLib({ 'contextRoot': packages[i] })
        console.log(resp.message)
      }

    } else {

      resp = await makeSingleLib({ contextRoot })
      console.log(resp.message)
    }
  }
}
