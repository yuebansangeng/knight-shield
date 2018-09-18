
import fg from 'fast-glob'
import chokidar from 'chokidar'
import minimist from 'minimist'
import path from 'path'
import yeomanEnv from 'yeoman-environment'
import logger from '../../../helpers/logger'

const argv = minimist(process.argv.slice(2))
const env = yeomanEnv.createEnv().register(require.resolve('../../build'), 'build')
const packages = JSON.parse(argv.packages)

packages.forEach(pack => {
  chokidar
    .watch(path.join(pack, 'src'))
    .on('change', (event, path) => {
      env.run('build lib', { 'source': pack })
      logger.info('rebuild', pack)
    })
})
