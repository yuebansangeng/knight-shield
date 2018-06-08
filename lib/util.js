'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('@storybook/addon-knobs/react');

var typeMap = {
  number: _react.number,
  object: _react.object,
  boolean: _react.boolean,
  text: _react.text,
  select: _react.select,
  date: _react.date,
  array: _react.array,
  color: _react.color,
  files: _react.files,
  selectV2: _react.selectV2
};

var handleType = function handleType(editProps) {
  var obj = {};
  editProps && editProps.map(function (_ref) {
    var name = _ref.name,
        _ref$type = _ref.type,
        type = _ref$type === undefined ? '' : _ref$type,
        value = _ref.value;

    if (type !== 'selectV2') {
      type = type.toLocaleLowerCase();
    }
    if (!typeMap[type]) return;
    obj[name] = typeMap[type](name, value);
  });
  return obj;
};

exports.default = handleType;
module.exports = exports['default'];