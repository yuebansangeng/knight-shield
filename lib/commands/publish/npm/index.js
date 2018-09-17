'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _yeomanGenerator = require('yeoman-generator');

var _yeomanGenerator2 = _interopRequireDefault(_yeomanGenerator);

var _updatePakcages = require('./update-pakcages');

var _updatePakcages2 = _interopRequireDefault(_updatePakcages);

var _publishPakcages = require('./publish-pakcages');

var _publishPakcages2 = _interopRequireDefault(_publishPakcages);

var _gitCheckout = require('./git-checkout');

var _gitCheckout2 = _interopRequireDefault(_gitCheckout);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = class extends _yeomanGenerator2.default {
  writing() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const { rc, contextRoot, onlyUpdated } = _this.options;
      const packinfo = _this.options.package;

      let { packages } = (0, _updatePakcages2.default)({ rc, contextRoot, 'package': packinfo });

      (0, _publishPakcages2.default)({ packages });

      (0, _gitCheckout2.default)();
    })();
  }
};
module.exports = exports['default'];