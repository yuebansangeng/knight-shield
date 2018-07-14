'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withScreenshot = undefined;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let screenshot = storyhandler => storyhandler;
let storybookChromeScreenshot = {};

// 检测是否安装了全局是否安装了屏幕截图的
// 客户端不安装该模块，Jenkins构建端会在全局安装此模块，意图是减少客户端安装无用的大体积的模块
if (_fs2.default.existsSync(`${process.cwd()}/node_modules/storybook-chrome-screenshot/package.json`)) {
  storybookChromeScreenshot = require('storybook-chrome-screenshot');
  screenshot = require('storybook-chrome-screenshot').withScreenshot;
}

exports.default = storybookChromeScreenshot;
const withScreenshot = exports.withScreenshot = screenshot;