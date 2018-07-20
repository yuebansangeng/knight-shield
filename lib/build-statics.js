'use strict';

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _child_process = require('child_process');

var _hjson = require('hjson');

var _hjson2 = _interopRequireDefault(_hjson);

var _makeStories = require('./make-stories');

var _makeStories2 = _interopRequireDefault(_makeStories);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

_dotenv2.default.config({ 'path': path.join(__dirname, '..', '.env') });

// 统一添加前缀组件模块前缀
const main = (() => {
  var _ref = _asyncToGenerator(function* () {
    const cpath = process.cwd();
    const { RC_FILENAME } = process.cwd();
    const { 'name': module, version } = require(`${cpath}/package.json`);

    // 获取rc配置文件中的配置
    let rc = {};
    if (_fs2.default.existsSync(`${cpath}/${RC_FILENAME}`)) {
      rc = _hjson2.default.parse(_fs2.default.readFileSync(`${cpath}/${RC_FILENAME}`, 'utf-8'));
    }

    // 组件名称
    const cname = rc.name || module;

    console.log(`${cname}/${version} 编译中...`);

    // 生成 stories.js 配置文件
    yield new _bluebird2.default((() => {
      var _ref2 = _asyncToGenerator(function* (resolve, reject) {
        // 生成配置文件
        yield (0, _makeStories2.default)();
        // 构建
        let { code, message } = yield new _bluebird2.default(function (resolve, reject) {
          let resmsg = [];
          let build_cp = (0, _child_process.spawn)('node', ['node_modules/.bin/build-storybook', '-c', `${__dirname}/.storybook`, '-o', `${cpath}/storybook-static/${cname}/${version}`], {
            'cwd': cpath
          });
          build_cp.stdout.on('data', function (data) {
            return resmsg.push(`${data}`);
          });
          build_cp.stderr.on('data', function (data) {
            return resmsg.push(`${data}`);
          });
          build_cp.on('close', function (code) {
            // 如果不join的方式输出log，会在输出信息换行时出现问题
            resolve({ code, 'message': resmsg.join('') });
          });
        });

        if (code !== 0) {
          throw new Error(message);
        } else {
          console.log(message);
        }
      });

      return function (_x, _x2) {
        return _ref2.apply(this, arguments);
      };
    })());
  });

  return function main() {
    return _ref.apply(this, arguments);
  };
})();

main();