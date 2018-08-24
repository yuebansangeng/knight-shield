'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

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
    }

    const { code, message } = yield (0, _requestPromise2.default)(`${CMP_SERVER_HOST}/users/upgrade-cmp-build?name=${name}&version=${version}&module=${module}&cinumber=${cinumber}&jobname=${jobname}`).then(function (res) {
      return JSON.parse(res);
    });

    if (code !== 200) {
      throw new Error(message);
    }
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
})();

module.exports = exports['default'];