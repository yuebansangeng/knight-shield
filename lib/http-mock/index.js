'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.adapterFeth = undefined;

var _harReader = require('./har-reader');

var _harReader2 = _interopRequireDefault(_harReader);

var _https = require('./https.json');

var _https2 = _interopRequireDefault(_https);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const adapterFeth = exports.adapterFeth = () => {
  let native = window.fetch;

  window.fetch = function (url, options) {

    return new Promise((resolve, reject) => {
      const har = new _harReader2.default({
        'har': _https2.default,
        'filters': []
      });

      const http = har.get(url);
      if (http) {
        return resolve(http);
      }

      return native(url, options);
    });
  };
};