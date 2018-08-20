'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _getFileContent = require('./get-file-content');

var _getExamples = require('../../../helpers/make-stories/get-examples');

var _getExamples2 = _interopRequireDefault(_getExamples);

var _check = require('./check');

var _check2 = _interopRequireDefault(_check);

var _record = require('./record');

var _record2 = _interopRequireDefault(_record);

var _readRc = require('@beisen/read-rc');

var _readRc2 = _interopRequireDefault(_readRc);

require('colors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = (() => {
  var _ref = _asyncToGenerator(function* (o) {
    const { CMP_SERVER_HOST } = process.env;
    const { contextRoot, cinumber, jobname } = o;
    const packinfo = require(_path2.default.join(contextRoot, 'package.json'));
    const rc = (0, _readRc2.default)(contextRoot);

    // 记录组件构建
    yield (0, _record2.default)({ 'package': packinfo, rc, cinumber, jobname });

    // 验证组件的配置
    yield (0, _check2.default)({ 'package': packinfo, rc });

    // 获取组件目录中定义的示例
    const examples = (0, _getExamples2.default)(contextRoot);

    // 组装接口上传需要的文件
    let formData = {
      'name': packinfo.name,
      'version': packinfo.version,
      'rc': JSON.stringify(rc),
      'package': JSON.stringify(packinfo),
      'examples': JSON.stringify(examples),
      'readme': (0, _getFileContent.getContent)(_path2.default.join(contextRoot, 'README.md'))

      // 开发者没有自定义examples
    };if (!examples.length) {
      formData['example_code_default'] = (0, _getFileContent.getContent)(`${__dirname}/default-example.ejs`);
      formData['example_css_default'] = '';
      formData.examples = JSON.stringify([{ 'name': 'default' }]);
    } else {
      // 提取组件示例的 js 和 css
      examples.forEach(function ({ name }) {
        formData[`example_code_${name}`] = (0, _getFileContent.getContent)(_path2.default.join(contextRoot, 'examples', name, 'index.js'));
        formData[`example_css_${name}`] = (0, _getFileContent.getContent)(_path2.default.join(contextRoot, 'examples', name, 'index.css'));
      });
    }

    // 开始发布组件到共享中心
    console.log(`${'Starting'.yellow} publishing`);

    return new Promise(function (resolve, reject) {
      _request2.default.post({
        'url': `${CMP_SERVER_HOST}/users/publish`,
        'form': formData
      }, function (err, resp, body) {
        resolve({ err, resp, body });
      });
    });
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
})();

module.exports = exports['default'];