
import execa from 'execa'
import logger from '../../../helpers/logger'

export default () => {
  logger.silly('gitCheckout', '.')
  return execa('git', [ 'checkout', '.' ])
}
