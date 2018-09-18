'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _yeomanGenerator = require('yeoman-generator');

var _yeomanGenerator2 = _interopRequireDefault(_yeomanGenerator);

var _readRc = require('../../helpers/read-rc');

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
    let packinfo = require(`${this.contextRoot}/package.json`);
    let contextRoot = this.contextRoot;

    let { source } = this.options;
    if (source) {
      contextRoot = source.match(/^\//) ? source : _path2.default.join(this.contextRoot, source);
      packinfo = require(`${contextRoot}/package.json`);
    }

    let rc = new _readRc2.default({ contextRoot });

    this.composeWith(require.resolve(compoesePath), Object.assign({}, this.options, {
      'rc': rc.toJSON(),
      'package': packinfo,
      contextRoot
    }));
  }
};
module.exports = exports['default'];