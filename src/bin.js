
import path from 'path'
import program from 'commander'
import yeomanEnv from 'yeoman-environment'
import pckJson from '../package.json'
import dotenv from 'dotenv'

dotenv.config({ 'path': path.join(__dirname, '..', '.env') })

const env = yeomanEnv.createEnv()
  .register(require.resolve('../lib/commands/storybook'), 'storybook')
  .register(require.resolve('../lib/commands/publish'), 'publish')
  .register(require.resolve('../lib/commands/build'), 'build')

program
  .version(pckJson.version, '-v, --version')

program
  .command('publish')
  .option('-s, --source [source]', '命令执行时所构建的组件项目')
  .option('-c, --cinumber [cinumber]', 'jenkins构建任务的指针')
  .option('-j, --jobname [jobname]', '构建任务的名称，用于定位构建任务')
  .option('-i, --independent [independent]', '组件单独发布')
  .description('发布组件到共享中心')
  .action(opts => {
    let { source, cinumber, jobname, independent } = opts
    env.run('publish', { source, cinumber, jobname, independent })
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

program
  .command('build <cmd>')
  .option('-s, --source [source]', '命令执行时所构建的组件项目')
  .option('-c, --watch [watch]', '监听目录文件变动重新构建')
  .description('构建组件的 lib 目录')
  .action((cmd, opts) => {
    let { source, watch } = opts
    env.run(`build ${cmd}`, { source, watch })
  })

program.parse(process.argv)

