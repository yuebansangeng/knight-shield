
import path from 'path'
import program from 'commander'
import yeomanEnv from 'yeoman-environment'
import pckJson from '../package.json'
import dotenv from 'dotenv'

dotenv.config({ 'path': path.join(__dirname, '..', '.env') })

const env = yeomanEnv.createEnv()
  .register(require.resolve('../lib/commands/storybook'), 'storybook')
  .register(require.resolve('../lib/commands/publish'), 'publish')

program
  .version(pckJson.version, '-v, --version')

program
  .command('publish')
  .option('-u, --username [username]', 'Gitlab账号名，创建项目时添加最高权限的用户，默认是当前机器上的 git user.name')
  .description('脚手架工具生成解决方案')
  .action(async (opts) => {
    let { username } = opts
    // 当前create命令还只支持组件项目，之后会逐步增加其他解决方案
    env.run('create component', { username })
  })

program
  .command('storybook <cmd>')
  .option('-s, --source [source]', '命令执行时所构建的组件项目')
  .option('-p, --port [port]', '调试服务的监听端口')
  .option('-i, --independent [independent]', '组件独立构建')
  .description('使用 storybook 功能 调试/构建 组件示例')
  .action((cmd, opts) => {
    let { source, port, independent } = opts
    env.run(`storybook ${cmd}`, { source, port, independent })
  })

program.parse(process.argv)
