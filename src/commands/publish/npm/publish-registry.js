
import npmPublish from '@lerna/npm-publish'
import runParallelBatches from '@lerna/run-parallel-batches'
import logger from '../../../helpers/logger'

// lernarc npm config
const lernarc = {
  'npmConfig': {
    'npmClient': 'npm'
  }
}
const distTag = 'bscpm-tag'
const concurrency = 10


export default o => {
  let { packages } = o

  const tracker = logger.newItem(`${lernarc.npmConfig.npmClient} publish`)
  tracker.addWork(packages.length)

  runParallelBatches(packages, concurrency, pkg =>
    npmPublish(pkg, distTag, lernarc.npmConfig)
      // postpublish is _not_ run when publishing a tarball
      // .then(() => this.runPackageLifecycle(pkg, "postpublish"))
      .then(() => {
        tracker.info('published', pkg.name)
        tracker.completeWork(1)
      })
  )
}