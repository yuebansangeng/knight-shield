'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _execa = require('execa');

var _execa2 = _interopRequireDefault(_execa);

var _readRc = require('../../../core/read-rc');

var _readRc2 = _interopRequireDefault(_readRc);

var _configConsumer = require('../../../core/config-consumer');

var _configConsumer2 = _interopRequireDefault(_configConsumer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = (() => {
  var _ref = _asyncToGenerator(function* (o) {
    const { contextRoot, output, lifecycle, configerRoot } = o;
    const { version } = require(`${contextRoot}/package.json`);
    const rc = new _readRc2.default({ contextRoot });

    // generate configs
    const configer = new _configConsumer2.default({ 'contextRoot': configerRoot, 'name': rc.get('name') });
    configer.generateStoriesJs([contextRoot]);
    configer.generateHttpHAREntry(rc.get('mock').https);

    lifecycle.run('prebuildOnly', { 'env': { 'PACKAGE_LOCATION': contextRoot } });

    return (0, _execa2.default)('npx', [`build-storybook`, '-c', configer.getConfigPath(), '-o', `${output || contextRoot}/storybook-static/${rc.get('name')}/${version}`], {});
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
})();

module.exports = exports['default'];