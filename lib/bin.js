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

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

_dotenv2.default.config({ 'path': _path2.default.join(__dirname, '..', '.env') });

const env = _yeomanEnvironment2.default.createEnv().register(require.resolve('../lib/commands/storybook'), 'storybook').register(require.resolve('../lib/commands/publish'), 'publish');

_commander2.default.version(_package2.default.version, '-v, --version');

_commander2.default.command('publish').option('-u, --username [username]', 'Gitlab账号名，创建项目时添加最高权限的用户，默认是当前机器上的 git user.name').description('脚手架工具生成解决方案').action((() => {
  var _ref = _asyncToGenerator(function* (opts) {
    let { username } = opts;
    // 当前create命令还只支持组件项目，之后会逐步增加其他解决方案
    env.run('create component', { username });
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
})());

_commander2.default.command('storybook <cmd>').option('-s, --source [source]', '命令执行时所构建的组件项目').option('-p, --port [port]', '调试服务的监听端口').option('-i, --independent [independent]', '组件独立构建').description('使用 storybook 功能 调试/构建 组件示例').action((cmd, opts) => {
  let { source, port, independent } = opts;
  env.run(`storybook ${cmd}`, { source, port, independent });
});

_commander2.default.parse(process.argv);