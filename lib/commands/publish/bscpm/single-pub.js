'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _getExamples = require('../../../helpers/make-stories/get-examples');

var _getExamples2 = _interopRequireDefault(_getExamples);

var _check = require('./check');

var _check2 = _interopRequireDefault(_check);

var _readRc = require('../../../helpers/read-rc');

var _readRc2 = _interopRequireDefault(_readRc);

var _child_process = require('child_process');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

let getContentIfExists = cp => {
  return _fs2.default.existsSync(cp) ? _fs2.default.readFileSync(cp, 'utf8') : '';
};

exports.default = (() => {
  var _ref = _asyncToGenerator(function* (o) {
    const { CMP_SERVER_HOST } = process.env;
    const { contextRoot } = o;
    const packinfo = require(_path2.default.join(contextRoot, 'package.json'));
    const rc = new _readRc2.default({ contextRoot });
    const rcJson = rc.toJSON();

    yield (0, _check2.default)({
      'module': packinfo.name,
      'name': rcJson.name,
      'team': rcJson.team
    });

    // 修改rc文件, 添加 developers
    const { stdout } = (0, _child_process.spawnSync)('git', ['config', 'user.name']);
    let username = `${stdout}`.replace(/^\s+|\s+$/, '');
    rcJson.developers = [username];

    const examples = (0, _getExamples2.default)(contextRoot);

    let formData = {
      'name': rcJson.name,
      'rc': JSON.stringify(rcJson),
      'version': packinfo.version,
      'package': JSON.stringify(packinfo),
      'examples': JSON.stringify(examples),
      'readme': getContentIfExists(_path2.default.join(contextRoot, 'README.md'))
    };

    if (!examples.length) {
      formData['example_code_default'] = getContentIfExists(`${__dirname}/example.ejs`);
      formData['example_css_default'] = '';
      formData.examples = JSON.stringify([{ 'name': 'default' }]);
    } else {
      examples.forEach(function ({ name }) {
        formData[`example_code_${name}`] = getContentIfExists(_path2.default.join(contextRoot, 'examples', name, 'index.js'));
        formData[`example_css_${name}`] = getContentIfExists(_path2.default.join(contextRoot, 'examples', name, 'index.css'));
      });
    }

    return yield _requestPromise2.default.post({
      'url': `${CMP_SERVER_HOST}/users/publish`,
      'form': formData
    }).then(function (res) {
      return JSON.parse(res);
    }).catch(function (err) {
      throw new Error(err);
    });
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
})();

module.exports = exports['default'];