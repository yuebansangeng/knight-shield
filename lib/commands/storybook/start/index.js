'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _yeomanGenerator = require('yeoman-generator');

var _yeomanGenerator2 = _interopRequireDefault(_yeomanGenerator);

var _configConsumer = require('../../../core/config-consumer');

var _configConsumer2 = _interopRequireDefault(_configConsumer);

var _generateHttpHarEntry = require('../../../core/generate-http-har-entry');

var _generateHttpHarEntry2 = _interopRequireDefault(_generateHttpHarEntry);

var _readRc = require('../../../core/read-rc');

var _readRc2 = _interopRequireDefault(_readRc);

var _execa = require('execa');

var _execa2 = _interopRequireDefault(_execa);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = class extends _yeomanGenerator2.default {

  writing() {
    var _this = this;

    return _asyncToGenerator(function* () {
      let { contextRoot, port = '9001', independent } = _this.options;
      const storybookConfigPath = _path2.default.join(__dirname, '../../../', 'configs');
      const rc = new _readRc2.default({ contextRoot });

      // independent
      const cmpPaths = independent ? rc.getComponentsPath() : [contextRoot];

      (0, _generateHttpHarEntry2.default)({ 'httpHARPath': rc.get('mock').https, contextRoot });

      const configer = new _configConsumer2.default({ contextRoot, 'name': rc.get('name') });
      configer.generateStoriesJs(cmpPaths);

      (0, _execa2.default)('npx', ['start-storybook', '-s', '.', '-p', port, '-c', configer.getConfigPath()], {
        'stdio': 'inherit'
      });
    })();
  }
};
module.exports = exports['default'];