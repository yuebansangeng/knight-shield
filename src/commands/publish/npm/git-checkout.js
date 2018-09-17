
import execa from 'execa'
import logger from '../../../helpers/logger'

export default (fileGlob, opts) => {
  logger.silly('gitCheckout', fileGlob)
  return execa('git', [ 'checkout', '--', fileGlob ], opts)
}
