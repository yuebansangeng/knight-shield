'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const { spawn, spawnSync } = require('child_process');
const { lstatSync, readdirSync } = require('fs');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const colors = require('colors');
const minimist = require('minimist');
const getdemos = require('./get-demos');
const colorlog = require('./color-log');
const Hjson = require('hjson');

// 配置需要的参数，需要改动维护的几率比较高
const cpath = process.cwd(); // cpath 组件调用命令传入的路径

const argv = minimist(process.argv.slice(2)); // 格式化传入参数 --port 5000 => { port: 5000 }

const storybookFolderName = '.storybook';

const storybookConfigPath = path.join(__dirname, '..', storybookFolderName);

const port = argv.port || '9001';

const customConfigFolerPath = `${cpath}/${storybookFolderName}`;

const customConfigFiles = { // 开发者自定义的配置文件
  'manager-head.html': { 'ori': 'manager-head.html' },
  'preview-head.html': { 'ori': 'preview-head.html' },
  'webpack.config.js': {
    'ori': 'webpack.config.js',
    'dest': 'webpack.extend.config.js'
  }
};

let main = (() => {
  var _ref = _asyncToGenerator(function* () {

    // 如何开发者配置了自定义文件，则复制使用自定义配置
    // todo: 会覆盖原有配置
    Object.keys(customConfigFiles).forEach(function (configFile) {
      const cusf = `${customConfigFolerPath}/${customConfigFiles[configFile]}`;
      if (fs.existsSync(cusf)) {
        const content = fs.readFileSync(cusf, 'utf8');
        const { ori, dest } = customConfigFiles[configFile];
        fs.writeFileSync(path.join(storybookConfigPath, dest || ori), content, 'utf8');
      }
    });

    // 如果开发者配置了 tsconfig，则copy配置文件
    if (fs.existsSync(`${cpath}/tsconfig.json`)) {
      const content = fs.readFileSync(`${cpath}/tsconfig.json`, 'utf8');
      fs.writeFileSync(path.join(storybookConfigPath, 'tsconfig.json'), content, 'utf8');
    }

    // 如果开发者配置了 babelrc，则copy配置文件
    if (fs.existsSync(`${cpath}/.babelrc`)) {
      const content = fs.readFileSync(`${cpath}/.babelrc`, 'utf8');
      fs.writeFileSync(path.join(storybookConfigPath, 'babelrc.json'), content, 'utf8');
    }

    // 配置 运行环境 需要的 stories 配置问题
    yield new Promise(function (resolve, reject) {
      ejs.renderFile(path.join(storybookConfigPath, 'stories.ejs'), {
        'examples': getdemos(path.join(cpath, 'examples')),
        'cpath': cpath
      }, {}, // ejs options
      function (err, storiesjs) {
        if (err) throw err;
        // 在组建项目中创建配置文件
        fs.writeFile(path.join(storybookConfigPath, 'stories.js'), storiesjs, function (err) {
          if (err) {
            console.log(err);
            return reject(false);
          }
          resolve(true);
        });
      });
    });

    // 运行 storyrbooks 调试环境
    // 使用 spwan 执行，需要和 gulp watch 命令并行执行
    // buildonly 只构建配置，不启动调试环境
    if (!argv.buildonly) {
      let cp_sbk = spawn('start-storybook', ['-s', '.', '-p', port, '-c', path.join(storybookConfigPath)],
      // tsconfig.json 的配置以及
      // ts-loader 模块获取需要在 dirname
      { 'cwd': cpath });
      cp_sbk.stdout.on('data', function (data) {
        return colorlog(data);
      });
      cp_sbk.stderr.on('data', function (err_data) {
        return colorlog(err_data);
      });
    } else {
      console.log('配置文件生成完毕');
    }
  });

  return function main() {
    return _ref.apply(this, arguments);
  };
})();

main();