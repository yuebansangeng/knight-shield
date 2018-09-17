
import execa from 'execa'
import Promise from 'bluebird'

export default o => {
  let { packages } = o

  return Promise.map(
    packages,
    async ([ pckname, pkg ]) => {

      return execa('npm', [ 'publish', '--access=public', '--ignore-scripts', '--tag', 'latest' ], {
          'cwd': pkg.location,
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
