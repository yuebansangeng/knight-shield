"use strict";

module.exports = data => {
  let printStr = `${data}`;
  if (printStr.match(/Storybook started on/ig)) {
    printStr = `${printStr}`.green;
  }
  process.stdout.write(printStr);
};