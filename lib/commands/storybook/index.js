'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _yeomanGenerator = require('yeoman-generator');

var _yeomanGenerator2 = _interopRequireDefault(_yeomanGenerator);

var _readRc = require('@beisen/read-rc');

var _readRc2 = _interopRequireDefault(_readRc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = class extends _yeomanGenerator2.default {

  constructor(args, opts) {
    super(args, opts);
    this.argument('cmd', { 'type': String, 'required': true });
  }

  composing() {
    this._private_resolve(`./${this.options.cmd}/index.js`);
  }

  _private_resolve(path) {
    let rc = (0, _readRc2.default)();
    const packinfo = require(`${this.contextRoot}/package.json`);

    this.composeWith(require.resolve(path), Object.assign({}, this.options, {
      rc,
      'package': packinfo,
      'contextRoot': this.contextRoot
    }));
  }
};
module.exports = exports['default'];