'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _yeomanGenerator = require('yeoman-generator');

var _yeomanGenerator2 = _interopRequireDefault(_yeomanGenerator);

var _singlePub = require('./single-pub');

var _singlePub2 = _interopRequireDefault(_singlePub);

var _fastGlob = require('fast-glob');

var _fastGlob2 = _interopRequireDefault(_fastGlob);

require('colors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = class extends _yeomanGenerator2.default {
  writing() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const { independent, rc, contextRoot, cinumber, jobname } = _this.options;

      let resp = null;

      if (independent) {

        let components = yield _fastGlob2.default.sync(rc.components, { 'onlyDirectories': true });
        components = components.map(function (cmp) {
          return _path2.default.join(contextRoot, cmp);
        });

        for (let i = 0; i < components.length; i++) {
          resp = yield (0, _singlePub2.default)({ 'contextRoot': components[i], cinumber, jobname });
          _this._private_response(resp);
        }
      } else {

        resp = yield (0, _singlePub2.default)({ contextRoot, cinumber, jobname });

        _this._private_response(resp);
      }
    })();
  }

  _private_response(res) {
    let { err, resp, body } = res;

    if (err || !/^2/.test(resp.statusCode)) {
      console.log(`${'Error'.red} publishing`);
      console.log(body);
      throw new Error(err);
    }

    // 处理结果返回值
    let { code, message } = JSON.parse(body);

    if (code === 200) {
      console.log(`${'Finished'.green} publishing`);
    } else {
      console.log(`${'Error'.red} publishing`);
      throw new Error(message);
    }
  }
};
module.exports = exports['default'];