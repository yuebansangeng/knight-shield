'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _makeStories = require('../../../helpers/make-stories');

var _makeStories2 = _interopRequireDefault(_makeStories);

var _readRc = require('../../../helpers/read-rc');

var _readRc2 = _interopRequireDefault(_readRc);

var _execa = require('execa');

var _execa2 = _interopRequireDefault(_execa);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = (() => {
  var _ref = _asyncToGenerator(function* (o) {
    const { contextRoot, output } = o;
    const { 'name': module, version } = require(`${contextRoot}/package.json`);
    const storybookConfigPath = _path2.default.join(__dirname, '../../../', 'configs');
    const rc = new _readRc2.default({ contextRoot });

    (0, _makeStories2.default)({ storybookConfigPath, 'cmpPaths': [contextRoot] });

    return (0, _execa2.default)('npx', [`build-storybook`, '-c', storybookConfigPath, '-o', `${output || contextRoot}/storybook-static/${rc.get('name')}/${version}`], {});
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
})();

module.exports = exports['default'];