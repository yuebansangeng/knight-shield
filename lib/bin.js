'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _yeomanEnvironment = require('yeoman-environment');

var _yeomanEnvironment2 = _interopRequireDefault(_yeomanEnvironment);

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config({ 'path': _path2.default.join(__dirname, '..', '.env') });

const env = _yeomanEnvironment2.default.createEnv().register(require.resolve('../lib/commands/storybook'), 'storybook').register(require.resolve('../lib/commands/publish'), 'publish').register(require.resolve('../lib/commands/build'), 'build');

_commander2.default.version(_package2.default.version, '-v, --version');

_commander2.default.command('publish [cmd]').option('-u, --username [username]', '开发者用户名').option('-s, --source [source]', '命令执行时所构建的组件项目').option('-i, --independent [independent]', '组件单独发布').option('-v, --only-updated [onlyUpdated]', '监听目录文件变动重新构建').description('发布组件到共享中心').action((cmd = 'bscpm', opts) => {
  // cmd = 'component'：默认执行component的命令
  let { source, independent, onlyUpdated, username } = opts;
  env.run(`publish ${cmd}`, { source, independent, onlyUpdated, username });
});

_commander2.default.command('storybook <cmd>').option('-s, --source [source]', '命令执行时所构建的组件项目').option('-p, --port [port]', '调试服务的监听端口').option('-i, --independent [independent]', '组件独立构建').option('-v, --only-updated [onlyUpdated]', '监听目录文件变动重新构建').description('使用 storybook 功能 调试/构建 组件示例').action((cmd, opts) => {
  let { source, port, independent, onlyUpdated } = opts;
  env.run(`storybook ${cmd}`, { source, port, independent, onlyUpdated });
});

_commander2.default.command('build <cmd>').option('-i, --independent [independent]', '组件独立构建lib').option('-s, --source [source]', '命令执行时所构建的组件项目').option('-c, --watch [watch]', '监听目录文件变动重新构建').description('构建组件的 lib 目录').action((cmd, opts) => {
  let { source, watch, independent } = opts;
  env.run(`build ${cmd}`, { source, watch, independent });
});

_commander2.default.parse(process.argv);