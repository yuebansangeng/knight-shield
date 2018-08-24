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

exports.default = (() => {
  var _ref = _asyncToGenerator(function* (o) {
    const {
      contextRoot,
      components = [contextRoot],
      output,
      onlyUpdated
    } = o;

    const { 'name': module, version } = require(`${contextRoot}/package.json`);
    const storybookConfigPath = _path2.default.join(__dirname, '../../../', 'configs');

    // only build updated module
    if (onlyUpdated) {
      let stdout = (0, _child_process.execSync)(`npm view ${module} versions`);
      if (`${stdout}`.match(new RegExp(`'${version}'`, 'ig'))) {
        return false;
      }
    }

    let rc = (0, _readRc2.default)(contextRoot);

    const cname = rc.name || module;

    (0, _makeStories2.default)({ storybookConfigPath, components });

    (0, _generateHttpHarEntry2.default)({
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