'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _yeomanGenerator = require('yeoman-generator');

var _yeomanGenerator2 = _interopRequireDefault(_yeomanGenerator);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _getFileContent = require('./get-file-content');

var _getExamples = require('../../../helpers/make-stories/get-examples');

var _getExamples2 = _interopRequireDefault(_getExamples);

var _check = require('./check');

var _check2 = _interopRequireDefault(_check);

var _record = require('./record');

var _record2 = _interopRequireDefault(_record);

require('colors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = class extends _yeomanGenerator2.default {
  writing() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const { contextRoot, 'package': packinfo, rc, cinumber, jobname } = _this.options;
      const { CMP_SERVER_HOST } = process.env;

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
        'package': (0, _getFileContent.getContent)(`${contextRoot}/package.json`),
        'examples': JSON.stringify(examples),
        'readme': (0, _getFileContent.getContent)(`${contextRoot}/README.md`)

        // 开发者没有自定义examples
      };if (!examples.length) {
        formData['example_code_default'] = (0, _getFileContent.getContent)(`${__dirname}/default-example.ejs`);
        formData['example_css_default'] = '';
        formData.examples = JSON.stringify([{ 'name': 'default' }]);
      } else {
        // 提取组件示例的 js 和 css
        examples.forEach(function ({ name }) {
          formData[`example_code_${name}`] = (0, _getFileContent.getContent)(`${contextRoot}/examples/${name}/index.js`);
          formData[`example_css_${name}`] = (0, _getFileContent.getContent)(`${contextRoot}/examples/${name}/index.css`);
        });
      }

      // 开始发布组件到共享中心
      console.log(`${'Starting'.yellow} publishing`);

      _request2.default.post({
        'url': `${CMP_SERVER_HOST}/users/publish`,
        'form': formData
      }, function (err, resp, body) {
        if (err || !/^2/.test(resp.statusCode)) {
          console.log(`${'Error'.red} publishing`);
          console.log(body);
          throw new Error(err);
        }

        // 处理结果返回值
        let { code, message } = JSON.parse(body);

        if (code === 200) {
          console.log(`${'Finished'.green} publishing`);
        } else {
          console.log(`${'Error'.red} publishing`);
          throw new Error(message);
        }
      });
    })();
  }
};
module.exports = exports['default'];