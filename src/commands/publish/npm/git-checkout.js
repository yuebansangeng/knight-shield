
import log 'npmlog'
import execa from 'execa'

export default gitCheckout = (fileGlob, opts) => {
  log.silly("gitCheckout", fileGlob)
  return execa('git', [ 'checkout', '--', fileGlob ], opts)
}
