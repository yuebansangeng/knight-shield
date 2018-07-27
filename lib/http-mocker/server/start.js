#!/usr/bin/env node
'use strict';

var _ = require('./');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var server = new _2.default({
  'workspace': process.cwd()
});

server.start();