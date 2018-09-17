'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _yeomanGenerator = require('yeoman-generator');

var _yeomanGenerator2 = _interopRequireDefault(_yeomanGenerator);

var _rsyncStroybookStatics = require('./rsync-stroybook-statics');

var _rsyncStroybookStatics2 = _interopRequireDefault(_rsyncStroybookStatics);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = class extends _yeomanGenerator2.default {
  writing() {
    const { contextRoot } = this.options;
    (0, _rsyncStroybookStatics2.default)({ contextRoot }).catch(err => console.log(err));
  }
};
module.exports = exports['default'];