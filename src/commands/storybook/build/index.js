
import path from 'path'
import Promise from 'bluebird'
import Generator from 'yeoman-generator'
import buildCmpStatics from './build-cmp-statics'
import generateHttpHAREntry from '../../../helpers/generate-http-har-entry'
import collectUpdates from '../../../helpers/collect-updates'
import logger from '../../../helpers/logger'
import ReadRC from '../../../helpers/read-rc'
import PackageGraph from '../../../helpers/package-graph'
import ConfigConsumer from '../../../helpers/config-consumer'

export default class extends Generator {

  async writing () {
    const { contextRoot, independent, onlyUpdated, 'package': packinfo } = this.options
    const rc = new ReadRC({ contextRoot })

    logger.enableProgress()
    let tracker = null

    // independent
    let cmpPaths = independent ? rc.getComponentsPath() : [ contextRoot ]

    // onlyUpdated
    if (onlyUpdated) {
      cmpPaths = await collectUpdates({
        contextRoot,
        // 'false': only need relative path, for git diff check
        'cmpPaths': independent ? rc.getComponentsPath(false) : [ '.' ]
      })
    }

    // generate configs
    const configer = new ConfigConsumer({ contextRoot, 'name': rc.get('name') })

    generateHttpHAREntry({ 'httpHARPath': rc.get('mock').https, contextRoot })

    // update moudules version first
    // after exec build statics
    new PackageGraph({
      contextRoot,
      'paths': independent ? rc.getLocalModulesPath() : [ contextRoot ]
    }).updatePackages(null, packinfo.version)

    tracker = logger.newItem('building', cmpPaths.length)

    // build statics 3
    await Promise.map(
      cmpPaths,
      cp => {

        logger.silly('building', cp)
        tracker.completeWork(1)

        return buildCmpStatics({ 'contextRoot': cp, 'output': contextRoot, configer })
      },
      // must 1, because config/stories.js
      { 'concurrency': 1 }
    ).then(() => {

      tracker.finish()
    })
  }
}
