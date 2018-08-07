"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Selecte = function Selecte(props) {
    var showDiv = props.showDiv,
        showList = props.showList,
        list = props.list,
        currentOption = props.currentOption,
        selected = props.selected;

    return _react2.default.createElement(
        "div",
        { className: showList ? "selected bgc" : "selected"
            /* style={{display : projectData.projectNum >3? "black" :"none" }} */
            , onClick: showDiv },
        _react2.default.createElement(
            "span",
            { className: "show" },
            currentOption,
            _react2.default.createElement("span", { className: "icon" })
        ),
        _react2.default.createElement(
            "div",
            { className: "list", style: { 'display': showList ? 'block' : 'none' } },
            _react2.default.createElement(
                "ul",
                null,
                list.map(function (item, index) {
                    return _react2.default.createElement(
                        "li",
                        { key: index,
                            onClick: selected.bind(undefined, index, item) },
                        item
                    );
                })
            )
        )
    );
};

exports.default = Selecte;
module.exports = exports["default"];