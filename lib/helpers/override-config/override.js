'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = o => {
  const { configPath, destinationPath, configs = [] } = o;

  let retFilesPath = [];

  configs.forEach(config => {

    const { ori = config, dest } = config;
    const configFilePath = `${configPath}/${ori}`;

    if (_fs2.default.existsSync(configFilePath)) {

      _fs2.default.writeFileSync(_path2.default.join(destinationPath, dest || ori), _fs2.default.readFileSync(configFilePath, 'utf8'), 'utf8');

      retFilesPath.push(configFilePath);
    }
  });

  return retFilesPath;
};

module.exports = exports['default'];