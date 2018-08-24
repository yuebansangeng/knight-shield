'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _child_process = require('child_process');

var _makeStories = require('../../../helpers/make-stories');

var _makeStories2 = _interopRequireDefault(_makeStories);

var _generateHttpHarEntry = require('../../../helpers/generate-http-har-entry');

var _generateHttpHarEntry2 = _interopRequireDefault(_generateHttpHarEntry);

var _readRc = require('../../../helpers/read-rc');

var _readRc2 = _interopRequireDefault(_readRc);

var _fastGlob = require('fast-glob');

var _fastGlob2 = _interopRequireDefault(_fastGlob);

var _execa = require('execa');

var _execa2 = _interopRequireDefault(_execa);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// 统一添加前缀组件模块前缀
exports.default = (() => {
  var _ref = _asyncToGenerator(function* (o) {
    const {
      contextRoot,
      components = [contextRoot],
      output,
      onlyUpdated
    } = o;

    const { 'name': module, version } = require(`${contextRoot}/package.json`);

    // 通过版本判断，只构建更新的组件
    if (onlyUpdated) {
      var stdout = (0, _child_process.execSync)(`npm view ${module} versions`);
      if (`${stdout}`.match(new RegExp(`'${version}'`, 'ig'))) return;
    }

    const storybookConfigPath = _path2.default.join(__dirname, '../../../', 'configs');

    // 获取rc配置文件中的配置
    let rc = (0, _readRc2.default)(contextRoot);

    // 组件名称
    const cname = rc.name || module;

    // 生成 stories.js 配置文件
    (0, _makeStories2.default)({ storybookConfigPath, components });

    // 生成 https HAR 配置文件
    (0, _generateHttpHarEntry2.default)({
      // 该构建任务是jenkins调用，无法在执行指令时配置参数，只能在rc文件中获取
      'httpHARPath': rc.mock.https,
      contextRoot
    });

    return yield (0, _execa2.default)('node', ['node_modules/.bin/build-storybook', '-c', storybookConfigPath, '-o', `${output || contextRoot}/storybook-static/${cname}/${version}`], {});
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
})();

module.exports = exports['default'];