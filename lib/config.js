'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _react3 = require('@storybook/react');

var _storybookReadme = require('storybook-readme');

var _stories = require('./stories.js');

var _stories2 = _interopRequireDefault(_stories);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _react3.configure)(function () {
  // 获取配置项
  var stories = _stories2.default.stories,
      name = _stories2.default.name,
      readme = _stories2.default.readme;


  var storiesInstence = (0, _react3.storiesOf)(name, module);
  storiesInstence.addDecorator((0, _storybookReadme.withReadme)([readme]));

  stories.forEach(function (_ref) {
    var name = _ref.name,
        story = _ref.story;
    var Component = story.content,
        editableProps = story.editableProps,
        _story$doc = story.doc,
        doc = _story$doc === undefined ? '' : _story$doc;

    storiesInstence.add(name, function () {
      return _react2.default.createElement(Component, null);
    });
  });
}, module);