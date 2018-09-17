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
    const { 'rc': { name, team }, 'package': { 'name': module } } = o;

    if (!name) {
      // can not happend
      throw new Error(`请在 rc 配置文件中，配置 name 字段`);
    }
    if (!name.match(/^[A-Za-z\-\d@\/]+?$/)) {
      throw new Error(`rc 文件中，name 字段只能包含有[A-Z,a-z,-,0-9,@,/]`);
    }

    const { code, message, data } = yield (0, _requestPromise2.default)(`${CMP_SERVER_HOST}/users/check-cmp?name=${name || ''}&team=${team || ''}&module=${module || ''}`).then(function (res) {
      return JSON.parse(res);
    });

    if (code !== 200 || !data) {
      throw new Error(message);
    }
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
})();

module.exports = exports['default'];