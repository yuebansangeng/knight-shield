
import execa from 'execa'
import Promise from 'bluebird'

export default o => {
  const { contextRoot } = o
  const { STATIC_SERVER_S } = process.env
  const servers = STATIC_SERVER_S.split(',')

  return Promise.map(
    // servers: user@ip:/path,...
    servers,
    server => {

      // either independent nor !, only have one storybook-static folder in the contextRoot
      return execa('rsync', [ '-av', `${contextRoot}/storybook-static/*`, server ], {
        'cwd': contextRoot,
        'stdout': 'inherit',
        'encoding': 'utf8'
      }).catch(({ stderr }) =>
        // output err, but do not stop process
        console.log(stderr)
      )

    },
    // execa 2 times once
    { 'concurrency': 2 }
  )
}
