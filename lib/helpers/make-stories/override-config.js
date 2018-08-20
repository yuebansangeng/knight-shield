'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// o.configs
// const configs = [
//   'tsconfig.json',
//   {
//     'ori': '.babelrc',
//     'dest': 'babelrc.json' // 转换成json文件，不需要处理.babelrc路径
//   }
// ]

exports.default = o => {

  const {
    // 配置文件获取的文件路径
    configPath = process.cwd(),
    // 配置文件需要复制到的目标路径
    destinationPath = `${__dirname}/.storybook`,
    // 配置文件描述
    configs = []
  } = o;

  // 开发者自定的配置文件
  let retFilesPath = [];

  // 循环配置文件，覆盖开发者传入的自定义配置
  configs.forEach(config => {

    const { ori = config, dest } = config;
    const configFilePath = `${configPath}/${ori}`;

    if (_fs2.default.existsSync(configFilePath)) {

      // 复制配置文件到目标路径下
      _fs2.default.writeFileSync(_path2.default.join(destinationPath, dest || ori), _fs2.default.readFileSync(configFilePath, 'utf8'), 'utf8');

      // 记录自定义配置文件
      retFilesPath.push(configFilePath);
    }
  });

  return retFilesPath;
};

module.exports = exports['default'];