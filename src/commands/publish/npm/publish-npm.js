
import execa from 'execa'
import Promise from 'bluebird'
import logger from '../../../helpers/logger'

export default o => {
  let { packages } = o

  logger.enableProgress()

  const tracker = logger.newItem(`npm publish`)
  tracker.addWork(packages.size)

  return Promise.map(
    packages,
    async ([ pckname, pkg ]) => {

      tracker.silly('publishing', pckname)
      tracker.completeWork(1)

      return execa('npm', [ 'publish', '--access=public', '--ignore-scripts', '--tag', 'latest' ], {
        'cwd': pkg.location,
        'stdout': 'inherit'
      })
    },
    // execa 5 times once
    { 'concurrency': 5 }
  )
}
