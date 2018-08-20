'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('colors');

exports.default = data => {
  let printStr = `${data}`;
  if (printStr.match(/Storybook started on/ig)) {
    printStr = `${printStr}`.green;
  }
  process.stdout.write(printStr);
};

module.exports = exports['default'];