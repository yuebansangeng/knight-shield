
import execa from 'execa'
import Promise from 'bluebird'
import logger from '../../../helpers/logger'

export default o => {

  return Promise.map(
    o.packages,
    ({ name, location }) => {

      logger.info('publishing', name)

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
    { 'concurrency': 3 }
  )
}
