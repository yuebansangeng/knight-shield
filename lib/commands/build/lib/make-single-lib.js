'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _execa = require('execa');

var _execa2 = _interopRequireDefault(_execa);

var _override = require('../../../helpers/override-config/override');

var _override2 = _interopRequireDefault(_override);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = (() => {
  var _ref = _asyncToGenerator(function* (o) {
    const { contextRoot } = o;
    const storybookConfigPath = _path2.default.join(__dirname, '..', '..', '..', 'configs');

    // custom configs override
    (0, _override2.default)({
      'configPath': contextRoot,
      'destinationPath': storybookConfigPath,
      'configs': ['gulpfile.js', 'tsconfig.json']
    });

    // TODO: Promise.map 10
    return yield (0, _execa2.default)('npx', ['gulp', '--gulpfile', _path2.default.join(__dirname, '..', '..', '..', 'configs', 'gulpfile.js'), '--cwd', contextRoot, '--colors'], { 'encoding': 'utf8' });
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
})();

module.exports = exports['default'];