'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _buildCmpStatics = require('../build-cmp-statics');

var _buildCmpStatics2 = _interopRequireDefault(_buildCmpStatics);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

_dotenv2.default.config({ 'path': _path2.default.join(__dirname, '..', '..', '.env') });

// 统一添加前缀组件模块前缀
const main = (() => {
  var _ref = _asyncToGenerator(function* (o) {
    const {
      independent,
      'source-path': sourcePath
    } = (0, _minimist2.default)(process.argv.slice(2));

    // 开发者可以自定义构建静路径
    let cpath = process.cwd();
    if (sourcePath) {
      cpath = _path2.default.join(process.cwd(), sourcePath);
    }

    let resp = null;
    if (independent) {} else {
      resp = yield (0, _buildCmpStatics2.default)({ cpath });
    }

    if (resp.code !== 0) {
      throw new Error(resp.message);
    } else {
      res = true;
      console.log(resp.message);
    }
  });

  return function main(_x) {
    return _ref.apply(this, arguments);
  };
})();

main();