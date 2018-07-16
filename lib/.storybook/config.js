'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _react3 = require('@storybook/react');

var _storybookReadme = require('storybook-readme');

var _screenshot = require('./screenshot');

var _stories = require('./stories.js');

var _stories2 = _interopRequireDefault(_stories);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _react3.configure)(() => {
  // 获取配置项
  let { stories, name, readme } = _stories2.default;

  let storiesInstence = (0, _react3.storiesOf)(name, module);
  storiesInstence.addDecorator((0, _screenshot.initScreenshot)());
  storiesInstence.addDecorator((0, _storybookReadme.withReadme)([readme]));

  stories.forEach(({ name, story }) => {
    const { 'content': Component } = story;
    storiesInstence.add(name, (0, _screenshot.withScreenshot)()(() => {
      return _react2.default.createElement(Component, null);
    }));
  });
}, module);