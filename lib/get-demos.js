'use strict';

const path = require('path');
const fs = require('fs');
const { lstatSync, readdirSync } = require('fs');

module.exports = source => {
  return readdirSync(source).map(name => path.join(source, name)).filter(source => lstatSync(source).isDirectory()).map(name => {
    return {
      'name': name.split('\/')[name.split('\/').length - 1]
    };
  });
};