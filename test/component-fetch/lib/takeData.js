"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var fetchData = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(_ref2) {
        var url = _ref2.url,
            _ref2$params = _ref2.params,
            params = _ref2$params === undefined ? {} : _ref2$params,
            _ref2$method = _ref2.method,
            method = _ref2$method === undefined ? 'get' : _ref2$method,
            _ref2$headers = _ref2.headers,
            headers = _ref2$headers === undefined ? {} : _ref2$headers,
            _ref2$mode = _ref2.mode,
            mode = _ref2$mode === undefined ? 'cors' : _ref2$mode,
            _ref2$credentials = _ref2.credentials,
            credentials = _ref2$credentials === undefined ? 'include' : _ref2$credentials;
        var options;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        options = {
                            method: method,
                            mode: mode,
                            credentials: credentials
                        };


                        url = BaseUrl + url;
                        headers = (0, _extends3.default)({}, defaultHeaders, headers);

                        if (method.toLowerCase() === 'post') {
                            headers['Content-Type'] = 'application/x-www-form-urlencoded';
                            options['headers'] = headers;
                        }

                        //参数格式化
                        if ((0, _keys2.default)(params).length != 0) {
                            if (method.toLowerCase() === 'get') {
                                url += "?" + _help2.default.paramSerializa(params);
                            } else {
                                options['body'] = _help2.default.paramSerializa(params);
                            }
                        }

                        return _context.abrupt("return", fetch(url, options).then(function (resp) {
                            if (resp.status === 200) return resp.json();
                            //错误抛出
                            throw Error("\u9519\u8BEF\u72B6\u6001\u7801\u4E3A" + resp.status);
                        }));

                    case 6:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function fetchData(_x) {
        return _ref.apply(this, arguments);
    };
}();

var _help = require("./help");

var _help2 = _interopRequireDefault(_help);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import { getBSGlobal } from '../helper'

var getBSGlobal = function getBSGlobal(name) {
    return BSGlobal && BSGlobal[name];
};

var BaseUrl = "//cloud." + getBSGlobal("webPath") + "/AssessMRest/100000";
var defaultHeaders = {
    "Content-Type": "application/json",
    'Accept': 'application/json, application/xml, text/play, text/html, *.*'
    /**
     * 
     * @param {*} param0 
     */
};exports.default = fetchData;
module.exports = exports["default"];