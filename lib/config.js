'use strict';

var _react = require('@storybook/react');

var _storybookReadme = require('storybook-readme');

var _react2 = require('@storybook/addon-knobs/react');

var _addonBackgrounds = require('@storybook/addon-backgrounds');

var _addonBackgrounds2 = _interopRequireDefault(_addonBackgrounds);

var _stories = require('./stories.js');

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _react.configure)(function () {
  var storiesInstence = (0, _react.storiesOf)(_stories.name, module);
  storiesInstence.addDecorator(_react2.withKnobs);
  storiesInstence.addDecorator((0, _storybookReadme.withReadme)([_stories.readme]));
  storiesInstence.addDecorator((0, _addonBackgrounds2.default)([{ 'name': "twitter", 'value': "white", 'default': true }, { 'name': "facebook", 'value': "#3b5998" }]));

  _stories.stories.forEach(function (_ref) {
    var name = _ref.name,
        story = _ref.story;
    var Component = story.content,
        editableProps = story.editableProps,
        _story$doc = story.doc,
        doc = _story$doc === undefined ? '' : _story$doc;

    storiesInstence.add(name, (0, _storybookReadme.withDocs)(doc, function () {
      var params = (0, _util2.default)(editableProps);
      return React.createElement(Component, params);
    }));
  });
}, module);