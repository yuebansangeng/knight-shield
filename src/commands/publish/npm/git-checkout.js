
import execa from 'execa'
import logger from '../../../helpers/logger'

export default (fileGlob, opts) => {
  logger.silly('gitCheckout', '.')
  return execa('git', [ 'checkout', '.' ], opts)
}
