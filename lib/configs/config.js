'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _react3 = require('@storybook/react');

var _storybookReadme = require('storybook-readme');

var _stories = require('./stories.js');

var _stories2 = _interopRequireDefault(_stories);

var _httpMock = require('../helpers/http-mock');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _httpMock.adapterFeth)();
(0, _httpMock.adapterXHR)();

(0, _react3.configure)(() => {
  _stories2.default.forEach(storieConfig => {
    // 获取配置项
    let { stories, name, readme } = storieConfig;
    let storiesInstence = (0, _react3.storiesOf)(name, module);

    storiesInstence.addDecorator((0, _storybookReadme.withReadme)([readme]));

    stories.forEach(({ name, story }) => {
      storiesInstence.add(name, () => _react2.default.createElement(story.component, null));
    });
  });
}, module);