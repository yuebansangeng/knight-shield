'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _execa = require('execa');

var _execa2 = _interopRequireDefault(_execa);

var _fastGlob = require('fast-glob');

var _fastGlob2 = _interopRequireDefault(_fastGlob);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// 通过 git diff 获取当前与上一次提交中的变动文件，然后筛选出更新的组件
exports.default = (() => {
  var _ref = _asyncToGenerator(function* (o) {
    let { contextRoot, independent, rc } = o;
    let args = ['diff', 'HEAD^', 'HEAD', '--name-only'];

    let cmpPaths = [contextRoot];

    if (independent) {
      if (rc.components && rc.components.length) {
        cmpPaths = _fastGlob2.default.sync(rc.components, { 'onlyDirectories': true });
      }

      if (cmpPaths && cmpPaths.length) {
        args = args.concat(['--']).concat(cmpPaths);
      }

      return yield (0, _execa2.default)('git', args).then(function ({ stdout }) {
        return stdout.split('\n');
      }).then(function (changeFiles) {
        let cfs = changeFiles.join(','); // O(n^2) => O(n)
        let res = [];
        for (var i = 0; i < cmpPaths.length; i++) {
          if (cfs.match(new RegExp(cmpPaths[i], 'ig'))) res.push(_path2.default.join(contextRoot, cmpPaths[i]));
        }
        return res;
      });
    } else {

      return cmpPaths;
    }
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
})();

module.exports = exports['default'];