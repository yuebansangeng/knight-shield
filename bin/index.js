#!/usr/bin/env node
'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _require = require('child_process'),
    spawn = _require.spawn,
    spawnSync = _require.spawnSync;

var path = require('path');
var fs = require('fs');
var ejs = require('ejs');

var _require2 = require('fs'),
    lstatSync = _require2.lstatSync,
    readdirSync = _require2.readdirSync;

var colors = require('colors');
var argv = require('minimist')(process.argv.slice(2));

var getDemos = function getDemos(source) {
  return readdirSync(source).map(function (name) {
    return path.join(source, name);
  }).filter(function (source) {
    return lstatSync(source).isDirectory();
  }).map(function (name) {
    return {
      'name': name.split('\/')[name.split('\/').length - 1],
      'hasEditableProps': !!fs.existsSync(path.join(name, 'editable-props.js')),
      'hasDoc': !!fs.existsSync(path.join(name, 'doc.md'))
    };
  });
};

var colorLog = function colorLog(data) {
  var printStr = '' + data;
  if (printStr.match(/Storybook started on/ig)) {
    printStr = ('' + printStr).green;
  }
  process.stdout.write(printStr);
};

var print = function print(cp) {
  cp.stdout.on('data', function (data) {
    return colorLog(data);
  });
  cp.stderr.on('data', function (err_data) {
    return colorLog(err_data);
  });
};

// cpath 组件调用命令传入的路径
var cpath = process.cwd();

var main = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return new _promise2.default(function (resolve, reject) {
              var configfiles = {
                'manager-head.html': cpath + '/.storybook/manager-head.html',
                'preview-head.html': cpath + '/.storybook/preview-head.html',
                'webpack.config.js': cpath + '/.storybook/webpack.config.js'
              };
              (0, _keys2.default)(configfiles).forEach(function (fkey) {
                if (fs.existsSync(configfiles[fkey])) {
                  var content = fs.readFileSync(configfiles[fkey], 'utf8');
                  if (fkey === 'webpack.config.js') {
                    fs.writeFileSync(path.join(__dirname, '..', 'lib', 'webpack.extend.config.js'), content, 'utf8');
                  } else {
                    fs.writeFileSync(path.join(__dirname, '..', 'lib', fkey), content, 'utf8');
                  }
                }
              });
              resolve(true);
            });

          case 2:
            _context.next = 4;
            return new _promise2.default(function (resolve, reject) {
              var configFile = 'tsconfig.json';
              if (fs.existsSync(cpath + '/' + configFile)) {
                var content = fs.readFileSync(cpath + '/' + configFile, 'utf8');
                fs.writeFileSync(path.join(__dirname, '..', 'lib', configFile), content, 'utf8');
              }
              resolve(true);
            });

          case 4:
            _context.next = 6;
            return new _promise2.default(function (resolve, reject) {
              var babelrcFile = '.babelrc';
              if (fs.existsSync(cpath + '/' + babelrcFile)) {
                var content = fs.readFileSync(cpath + '/' + babelrcFile, 'utf8');
                // 转换JSON格式后，再次转换，避免 .json 格式引用出错
                var contentJsonText = '';
                try {
                  var contentJson = JSON.parse(content);
                  contentJsonText = (0, _stringify2.default)(contentJson, null, 2);
                } catch (e) {
                  return console.log('.babelrc 文件内容异常，不是标准JSON结构');
                }
                fs.writeFileSync(path.join(__dirname, '..', 'lib', 'babelrc.json'), contentJsonText, 'utf8');
              }
              resolve(true);
            });

          case 6:
            _context.next = 8;
            return new _promise2.default(function (resolve, reject) {
              ejs.renderFile(path.join(__dirname, '..', 'lib', 'templates', 'stories.ejs'), {
                'examples': getDemos(path.join(cpath, 'examples')),
                'cpath': cpath
              }, {}, // ejs options
              function (err, storiesjs) {
                if (err) throw err;
                // 在组建项目中创建配置文件
                fs.writeFile(path.join(__dirname, '..', 'lib', 'stories.js'), storiesjs, function (err) {
                  if (err) {
                    console.log(err);
                    return reject(false);
                  }
                  resolve(true);
                });
              });
            });

          case 8:

            // 运行 storyrbooks 调试环境
            // 使用 spwan 执行，需要和 gulp watch 命令并行执行
            // buildonly 只构建配置，不启动调试环境
            if (!argv.buildonly) {
              print(spawn('start-storybook', ['-s', '.', '-p', argv.port || '9001', '-c', path.join(__dirname, '..', 'lib')],
              // tsconfig.json 的配置以及
              // ts-loader 模块获取需要在 dirname
              { 'cwd': process.cwd() }));
            } else {
              console.log('配置文件生成完毕');
            }

          case 9:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function main() {
    return _ref.apply(this, arguments);
  };
}();

main();