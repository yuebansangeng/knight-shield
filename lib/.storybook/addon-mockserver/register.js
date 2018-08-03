'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addChannel = exports.init = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _addons = require('@storybook/addons');

var _addons2 = _interopRequireDefault(_addons);

var _panel = require('./components/panel');

var _panel2 = _interopRequireDefault(_panel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ADDON_ID = 'storybook-addon-mockserver';
const PANEL_ID = `${ADDON_ID}/addon-panel`;

const addChannel = api => {
  const channel = _addons2.default.getChannel();

  _addons2.default.addPanel(PANEL_ID, {
    title: 'MockServer',
    render() {
      return _react2.default.createElement(_panel2.default, { channel: channel, api: api });
    }
  });
};

const init = () => {
  _addons2.default.register(ADDON_ID, addChannel);
};

exports.init = init;
exports.addChannel = addChannel;