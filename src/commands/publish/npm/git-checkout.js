
import execa from 'execa'
import logger from '../../../helpers/logger'

export default gitCheckout = (fileGlob, opts) => {
  log.silly("gitCheckout", fileGlob)
  return execa('git', [ 'checkout', '--', fileGlob ], opts)
}
