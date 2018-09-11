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

var _child_process = require('child_process');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = class extends _yeomanGenerator2.default {

  constructor(args, opts) {
    super(args, opts);
    this.argument('cmd', { 'type': String, 'required': false, 'default': 'component' });
  }

  composing() {
    this._private_resolve(`./${this.options.cmd}/index.js`);
  }

  _private_resolve(compoesePath) {
    let packinfo = require(`${this.contextRoot}/package.json`);
    let contextRoot = this.contextRoot;
    //修改rc文件
    const { stdout } = (0, _child_process.spawnSync)('git', ['config', 'user.name']);
    let username = `${stdout}`.replace(/^\s+|\s+$/, '');

    let rcinfo = JSON.parse(_fs2.default.readFileSync(`${this.contextRoot}/.bscpmrc`, 'utf-8'));

    let developers = Array.isArray(rcinfo.developers) ? rcinfo.developers : [];

    rcinfo.developers = developers.includes(`${username}`) ? developers : developers.concat(`${username}`);

    _fs2.default.writeFileSync(`${this.contextRoot}/.bscpmrc`, JSON.stringify(rcinfo, null, 2), 'utf-8');

    let { source } = this.options;
    if (source) {
      contextRoot = source.match(/^\//) ? source : _path2.default.join(this.contextRoot, source);
      packinfo = require(`${contextRoot}/package.json`);
    }

    this.composeWith(require.resolve(compoesePath), Object.assign({}, this.options, {
      'rc': (0, _readRc2.default)(contextRoot),
      'package': packinfo,
      contextRoot
    }));
  }
};
module.exports = exports['default'];