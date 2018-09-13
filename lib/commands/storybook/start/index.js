'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _yeomanGenerator = require('yeoman-generator');

var _yeomanGenerator2 = _interopRequireDefault(_yeomanGenerator);

var _child_process = require('child_process');

var _makeStories = require('../../../helpers/make-stories');

var _makeStories2 = _interopRequireDefault(_makeStories);

var _overrideConfig = require('../../../helpers/override-config');

var _overrideConfig2 = _interopRequireDefault(_overrideConfig);

var _generateHttpHarEntry = require('../../../helpers/generate-http-har-entry');

var _generateHttpHarEntry2 = _interopRequireDefault(_generateHttpHarEntry);

var _prepareCmpPaths = require('../../../helpers/prepare-cmp-paths');

var _prepareCmpPaths2 = _interopRequireDefault(_prepareCmpPaths);

var _fastGlob = require('fast-glob');

var _fastGlob2 = _interopRequireDefault(_fastGlob);

var _execa = require('execa');

var _execa2 = _interopRequireDefault(_execa);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = class extends _yeomanGenerator2.default {

  writing() {
    var _this = this;

    return _asyncToGenerator(function* () {
      let { contextRoot, rc, port = '9001', independent } = _this.options;
      const storybookConfigPath = _path2.default.join(__dirname, '../../../', 'configs');

      (0, _overrideConfig2.default)({ contextRoot, storybookConfigPath });

      let cmpPaths = (0, _prepareCmpPaths2.default)({ contextRoot, independent, rc });

      (0, _makeStories2.default)({ storybookConfigPath, cmpPaths });

      (0, _generateHttpHarEntry2.default)({ 'httpHARPath': rc.mock.https, contextRoot });

      (0, _execa2.default)('npx', ['start-storybook', '-s', '.', '-p', port, '-c', storybookConfigPath], {
        'stdio': 'inherit'
      });
    })();
  }
};
module.exports = exports['default'];