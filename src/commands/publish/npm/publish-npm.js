
import execa from 'execa'
import Promise from 'bluebird'
import logger from '../../../helpers/logger'

export default o => {
  let { localPackages, publishCmpNames } = o

  return Promise.map(
    localPackages,
    ([ pckname, pkg ]) => {
      // filter cmps
      if (!publishCmpNames.includes(pckname)) return

      const { location } = pkg

      logger.info('publishing', pckname)

      return execa('npm', [ 'publish', '--access=public', '--ignore-scripts', '--tag', 'latest' ], {
          'cwd': location,
          'stdout': 'inherit',
          'encoding': 'utf8'
        })
        // output err, but do not stop process
        .catch(({ stderr }) =>
          console.log(stderr)
        )
    },
    // execa 5 times once
    { 'concurrency': 5 }
  )
}
