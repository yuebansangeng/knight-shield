'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _yeomanGenerator = require('yeoman-generator');

var _yeomanGenerator2 = _interopRequireDefault(_yeomanGenerator);

var _fastGlob = require('fast-glob');

var _fastGlob2 = _interopRequireDefault(_fastGlob);

var _buildCmpStatics = require('./build-cmp-statics');

var _buildCmpStatics2 = _interopRequireDefault(_buildCmpStatics);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = class extends _yeomanGenerator2.default {

  writing() {
    var _this = this;

    return _asyncToGenerator(function* () {
      let { contextRoot, independent, rc, output, resp = null } = _this.options;

      if (independent) {

        let components = yield _fastGlob2.default.sync(rc.components, { 'onlyDirectories': true });
        components = components.map(function (cmp) {
          return _path2.default.join(contextRoot, cmp);
        });

        for (let i = 0; i < components.length; i++) {
          resp = yield (0, _buildCmpStatics2.default)({
            'contextRoot': components[i],
            'output': output || contextRoot
          });

          if (resp.code !== 0) {
            throw new Error(resp.message);
          } else {
            console.log(resp.message);
          }
        }
      } else {

        resp = yield (0, _buildCmpStatics2.default)({ contextRoot });

        if (resp.code !== 0) {
          throw new Error(resp.message);
        } else {
          console.log(resp.message);
        }
      }
    })();
  }
};
module.exports = exports['default'];