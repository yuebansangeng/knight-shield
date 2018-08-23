
import fg from 'fast-glob'
import chokidar from 'chokidar'
import minimist from 'minimist'
import path from 'path'
import execa from 'execa'
import yeomanEnv from 'yeoman-environment'
import logger from '../../../helpers/logger'

const argv = minimist(process.argv.slice(2))
const env = yeomanEnv.createEnv().register(require.resolve('../../build'), 'build')

const { 'context-root': contextRoot, workspaces } = argv

let packages = fg.sync(JSON.parse(workspaces), { 'onlyDirectories': true })

// 如果没有传递 workspaces 则默认监听当前目录 src 变动
if (!packages || !packages.length) packages = [ contextRoot ]

packages.forEach(pack => {
  chokidar
    .watch(path.join(pack, 'src'))
    .on('change', (event, path) => {
      env.run('build lib', { 'source': pack })
      logger.info('rebuild', pack)
    })
})
