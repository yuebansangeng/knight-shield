'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

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

  _private_resolve(compoesePath) {
    const packinfo = require(`${this.contextRoot}/package.json`);

    // 使用者通过 source 控制命令执行路径
    let contextRoot = this.contextRoot;
    if (this.options.source) {
      contextRoot = _path2.default.join(this.contextRoot, this.options.source);
    }

    this.composeWith(require.resolve(compoesePath), Object.assign({}, this.options, {
      'rc': (0, _readRc2.default)(contextRoot),
      'package': packinfo,
      'contextRoot': contextRoot
    }));
  }
};
module.exports = exports['default'];