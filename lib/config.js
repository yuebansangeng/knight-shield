'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _react3 = require('@storybook/react');

var _storybookReadme = require('storybook-readme');

var _react4 = require('@storybook/addon-knobs/react');

var _stories = require('./stories.js');

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _react3.configure)(function () {
  var storiesInstence = (0, _react3.storiesOf)(_stories.name, module);
  storiesInstence.addDecorator(_react4.withKnobs);
  storiesInstence.addDecorator((0, _storybookReadme.withReadme)([_stories.readme]));

  _stories.stories.forEach(function (_ref) {
    var name = _ref.name,
        story = _ref.story;
    var Component = story.content,
        editableProps = story.editableProps,
        _story$doc = story.doc,
        doc = _story$doc === undefined ? '' : _story$doc;

    storiesInstence.add(name, function () {
      var params = (0, _util2.default)(editableProps);
      return _react2.default.createElement(Component, params);
    });
  });
}, module); // withDocs