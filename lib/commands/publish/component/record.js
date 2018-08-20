'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = (() => {
  var _ref = _asyncToGenerator(function* (o) {
    const { CMP_SERVER_HOST } = process.env;
    let {
      cinumber = '0',
      jobname = 'build',
      'rc': { name },
      'package': { 'name': module, version }
    } = o;

    if (!name || !name.match(/^[A-Za-z\-\d]+?$/)) {
      name = 'unknown';
      console.log(`组件 rc 文件中的 name 属性格式不正确，只允许是字母、数字、中划线`);
    }

    let { code, message } = yield new Promise(function (resolve, reject) {
      (0, _request2.default)(`${CMP_SERVER_HOST}/users/upgrade-cmp-build?name=${name}&version=${version}&module=${module}&cinumber=${cinumber}&jobname=${jobname}`, function (err, res, body) {
        if (err) {
          console.log(err);
          return reject(err);
        }
        resolve(JSON.parse(body));
      });
    });

    if (code !== 200) {
      throw new Error(message);
    }

    console.log(message);
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
})();

module.exports = exports['default'];